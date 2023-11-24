from rest_framework import serializers
from ..models import Evaluation, EvaluationCriteria

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    criteria = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationCriteria
        fields = ('evaluation', 'criteria', 'value')

    def get_criteria(self, obj):
        return obj.criteria.name
    