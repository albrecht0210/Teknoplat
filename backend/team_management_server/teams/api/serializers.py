from rest_framework import serializers
from ..models import Team
from courses.api.serializers import CourseSerializer

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'description', 'max_members', 'course')
