from rest_framework import serializers
from ..models import Criteria, MeetingCriteria

class CriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = '__all__'
    
class MeetingCriteriaSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    meeting = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = MeetingCriteria
        fields = ('id', 'meeting', 'name', 'description', 'weight', 'criteria')

    def get_name(self, obj):
        return obj.criteria.name
    
    def get_meeting(self, obj):
        return obj.meeting.name
    
    def get_description(self, obj):
        return obj.criteria.description
    