from django.contrib import admin
from .models import MaterialType, Material, SterilizationStage, Failure

admin.site.register(MaterialType)
admin.site.register(Material)
admin.site.register(SterilizationStage)
admin.site.register(Failure)