import requests
import json
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from ..models import Activity
from .serializers import ActivitySerializer
from activity_management_server.permissions import IsTeacherUserOrReadOnly

Account = get_user_model()

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
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

    def fetch_course(self, course_id):
        headers = self.get_auth_headers()
        response = requests.get(f'http://localhost:8080/api/courses/{course_id}/', headers=headers)
        return response
    
    def fetch_service(self, service_id):
        headers = self.get_auth_headers()
        response = requests.get(f'http://localhost:8000/api/services/{service_id}/', headers=headers)
        return response
    
    def push_activity_to_teknoplat_meeting(self, request_data):
        headers = self.get_auth_headers()
        response = requests.post(f'http://localhost:8008/api/meeting/create/', data=request_data, headers=headers)
        return response
    
    def create(self, request, *args, **kwargs):
        service_id = request.data.get('service')
        course_id = request.data.get('course')

        service = self.fetch_service(service_id=service_id)

        if self.has_error_response(service.status_code):
            return Response({'error': 'Failed to fetch services.'}, status=status.HTTP_400_BAD_REQUEST)

        course = self.fetch_course(course_id=course_id)

        if self.has_error_response(course.status_code):
            return Response({'error': 'Failed to fetch courses.'}, status=status.HTTP_400_BAD_REQUEST)

        service_data = json.loads(service.content.decode('utf-8'))
        
        if "teknoplat" in service_data['identifier'].lower():
            meeting_data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
                'course': request.data.get('course'),
                'status':  request.data.get('status'),
                'owner': request.data.get('owner')
            }

            meeting_create = self.push_activity_to_teknoplat_meeting(request_data=meeting_data)

            if self.has_error_response(meeting_create.status_code):
                return Response({'error': 'Failed to create meeting.'}, status=status.HTTP_400_BAD_REQUEST)

        account = get_object_or_404(Account, pk=request.data.get('owner'))

        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
