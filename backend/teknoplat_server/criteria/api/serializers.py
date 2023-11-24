from rest_framework import serializers
from ..models import Criteria, MeetingCriteria

class CriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = '__all__'
    
class MeetingCriteriaSerializer(serializers.ModelSerializer):
    criteria = serializers.SerializerMethodField()
    meeting = serializers.SerializerMethodField()

    class Meta:
        model = MeetingCriteria
        fields = ('meeting', 'criteria', 'weight')

    def get_criteria(self, obj):
        return obj.criteria.name
    
    def get_meeting(self, obj):
        return obj.meeting.name