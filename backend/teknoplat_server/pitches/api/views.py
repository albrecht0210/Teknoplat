import requests
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Pitch
from .serializers import PitchSerializer
from teknoplat_server.permissions import IsTeacherUserOrReadOnly

class PitchViewSet(viewsets.ModelViewSet):
    queryset = Pitch.objects.all()
    serializer_class = PitchSerializer
    permission_classes = (permissions.IsAuthenticated, IsTeacherUserOrReadOnly, )

    def get_auth_headers(self):
        authorization_header = self.request.META.get('HTTP_AUTHORIZATION', None)
        _, token = authorization_header.split()
        return {'Authorization': f"Bearer {token}"}

    def has_error_response(self, status_code):
        error_response_map = [500, 400, 401, 403, 404]
        if status_code in error_response_map:
            return True
        return False

    def fetch_team(self, team_id):
        headers = self.get_auth_headers()
        response = requests.get(f'http://localhost:8080/api/teams/{team_id}/', headers=headers)
        return response
    
    def fetch_team_members(self, team_id):
        headers = self.get_auth_headers()
        response = requests.get(f'http://localhost:8080/api/teams/{team_id}/get_team_members/', headers=headers)
        return response
    
    def create(self, request, *args, **kwargs):
        team_id = request.data.get('team')
        team = self.fetch_team(team_id)

        if self.has_error_response(team.status_code):
            return Response({'error': 'Failed to fetch teams.'}, status=status.HTTP_400_BAD_REQUEST)

        pitch_serializer = self.get_serializer(data=request.data)

        if pitch_serializer.is_valid():
            pitch_serializer.save()
            return Response(pitch_serializer.data, status=status.HTTP_201_CREATED)
        return Response(pitch_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def get_team(self, request, pk=None):
        pitch = self.get_object()
        team = self.fetch_team(pitch.team)
        
        return Response(team.json(), status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def get_team_members(self, request, pk=None):
        pitch = self.get_object()
        members = self.fetch_team_members(pitch.team)
        
        return Response(members.json(), status=status.HTTP_200_OK)

    
