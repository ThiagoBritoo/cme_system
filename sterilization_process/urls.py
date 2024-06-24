from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialTypeViewSet, SterilizationStageViewSet, MaterialViewSet, FailureViewSet, StageHistoryViewSet, generate_completed_report_pdf, generate_failed_report_xlsx, index

router = DefaultRouter()
router.register(r'material-types', MaterialTypeViewSet)
router.register(r'sterilization-stages', SterilizationStageViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'failures', FailureViewSet)
router.register(r'stage-history', StageHistoryViewSet)


urlpatterns = [
    path('', index, name='index'), 
    path('api/', include(router.urls)),
    path('relatorio/concluidos/', generate_completed_report_pdf, name='relatorio_concluidos'),
    path('relatorio/falhas/', generate_failed_report_xlsx, name='relatorio_falhas'),
]