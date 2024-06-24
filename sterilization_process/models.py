from django.db import models
from django.utils import timezone

class MaterialType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    

class SterilizationStage(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Material(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    material_type = models.ForeignKey(MaterialType, on_delete=models.SET_NULL, null=True)
    current_stage = models.ForeignKey(SterilizationStage, on_delete=models.SET_NULL, null=True, blank=True, related_name='materials')
    timestamp = models.DateTimeField(auto_now_add=True)
   
    def __str__(self):
        return self.name
    
    def advance_stage(self):
        if self.current_stage and self.current_stage.name == 'Concluido':
            return
        
        if self.current_stage:
            next_stage_id = self.current_stage.id + 1
            try:
                next_stage = SterilizationStage.objects.get(id=next_stage_id)
                self.current_stage = next_stage
                self.timestamp = timezone.now()
            except SterilizationStage.DoesNotExist:
                raise ValueError("Não foi possível encontrar a próxima etapa. Verifique se todas as etapas estão definidas corretamente.")
        else:
            # Inicializa o estágio para "Recebimento" se não estiver definido
            try:
                self.current_stage = SterilizationStage.objects.get(id=1)
                self.timestamp = timezone.now()
            except SterilizationStage.DoesNotExist:
                raise ValueError("A etapa inicial 'Recebimento' não está definida. Verifique a configuração inicial das etapas.")
        
        self.save()
        StageHistory.objects.create(material=self, stage=self.current_stage, timestamp=self.timestamp)
        
    @property
    def current_stage_name(self):
        if self.current_stage:
            return self.current_stage.name
        return 'Nenhum processo definido'


class Failure(models.Model):
    id = models.AutoField(primary_key=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    stage = models.ForeignKey(SterilizationStage, on_delete=models.CASCADE)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Falha no {self.material.name} - {self.stage.name} em {self.timestamp}'


class StageHistory(models.Model):
    id = models.AutoField(primary_key=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    stage = models.ForeignKey(SterilizationStage, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()

    def __str__(self):
        return f'{self.material.name} passou pelo estágio {self.stage.name} em {self.timestamp}'
