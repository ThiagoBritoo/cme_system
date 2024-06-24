from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets, status
from .models import MaterialType, SterilizationStage, Material, Failure, StageHistory
from .serializers import MaterialTypeSerializer, SterilizationStageSerializer, MaterialSerializer, FailureSerializer, StageHistorySerializer
from django.http import FileResponse, HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
import openpyxl

class MaterialTypeViewSet(viewsets.ModelViewSet):
    queryset = MaterialType.objects.all()
    serializer_class = MaterialTypeSerializer

class SterilizationStageViewSet(viewsets.ModelViewSet):
    queryset = SterilizationStage.objects.all()
    serializer_class = SterilizationStageSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

    @action(detail=True, methods=['post'])
    def advance_stage(self, request, pk=None):
        material = self.get_object()
        try:
            material.advance_stage()
            return Response({'status': 'stage advanced'})
        except ValueError as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        request_data = request.data.copy()
        
        # Define o estágio inicial como "Recebimento" (id=1)
        try:
            recebimento_stage = SterilizationStage.objects.get(name='Recebimento')
            request_data['current_stage'] = recebimento_stage.id
        except SterilizationStage.DoesNotExist:
            return Response({'error': 'A etapa inicial "Recebimento" não está definida.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = MaterialSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FailureViewSet(viewsets.ModelViewSet):
    queryset = Failure.objects.all()
    serializer_class = FailureSerializer

class StageHistoryViewSet(viewsets.ModelViewSet):
    queryset = StageHistory.objects.all()
    serializer_class = StageHistorySerializer

    def get_queryset(self):
        material_id = self.request.query_params.get('material')
        if material_id:
            return StageHistory.objects.filter(material_id=material_id)
        return super().get_queryset()

def generate_completed_report_pdf(request):
    buffer = io.BytesIO()

    p = canvas.Canvas(buffer, pagesize=letter)

    p.drawString(100, 750, "Relatório de Materiais Concluídos")

    materials = Material.objects.filter(current_stage__name="Concluido")

    y = 700
    for material in materials:
        material_type_name = material.material_type.name if material.material_type else 'Desconhecido'
        p.drawString(100, y, f"Material: {material.name}")
        p.drawString(100, y-15, f"Tipo: {material_type_name}")
        p.drawString(100, y-30, f"Concluído em: {material.timestamp.strftime('%H:%M:%S %d/%m/%Y')}")
        y -= 50
        if y < 50:  
            p.showPage()
            y = 750

    p.showPage()
    p.save()

    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='materiais_concluidos.pdf')

def generate_failed_report_xlsx(request):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Relatório de Falhas"

    headers = ["Material", "Processo", "Descrição", "Ocorreu em"]
    ws.append(headers)

    failures = Failure.objects.all()
    for failure in failures:
        row = [
            failure.material.name if failure.material else 'Desconhecido',
            failure.stage.name if failure.stage else 'Desconhecido',
            failure.description,
            failure.timestamp.strftime('%H:%M:%S %d/%m/%Y')
        ]
        ws.append(row)

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=relatorio_falhas.xlsx'

    wb.save(response)
    return response


def index(request):
    return render(request, 'index.html')