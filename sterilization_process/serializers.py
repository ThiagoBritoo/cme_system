from rest_framework import serializers
from .models import MaterialType, SterilizationStage, Material, Failure, StageHistory

class MaterialTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialType
        fields = '__all__'

class SterilizationStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SterilizationStage
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class FailureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Failure
        fields = '__all__'

class StageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StageHistory
        fields = '__all__'
