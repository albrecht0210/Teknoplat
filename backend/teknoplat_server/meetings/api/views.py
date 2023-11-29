import requests
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from ..models import Meeting
from .serializers import CreateMeetingSerializer, MeetingSerializer
from teknoplat_server.permissions import IsTeacherUserOrReadOnly

from pitches.models import Pitch
from pitches.api.serializers import PitchSerializer

from criteria.models import Criteria, MeetingCriteria
from criteria.api.serializers import MeetingCriteriaSerializer

from comments.models import Comment
from comments.api.serializers import CommentSerializer

class MeetingCreateAPIView(generics.CreateAPIView):
    serializer_class = CreateMeetingSerializer
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

    def perform_create(self, serializer):
        instance = serializer.save()
        course = self.fetch_course(course_id=instance.course)
        if self.has_error_response(course.status_code):
            return Response({'error': 'Failed to fetch courses.'}, status=status.HTTP_400_BAD_REQUEST)

        course_data = json.loads(course.content.decode('utf-8'))
        channel_layer = get_channel_layer()

        room_name = f'{course_data['code']}'

        room_meeting_group_name = f'meeting_{room_name}'

        async_to_sync(channel_layer.group_send)(
            room_meeting_group_name,
            {
                'type': 'new_meeting_message',
                'meeting': instance,
            },
        )

        room_notification_group_name = f'meeting_notification_{room_name}'

        async_to_sync(channel_layer.group_send)(
            room_notification_group_name,
            {
                'type': 'new_meeting_message',
                'meeting': f'New meeting in {course_data['name']}',
            },
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    pagination_class = LimitOffsetPagination
    permission_classes = (permissions.IsAuthenticated, IsTeacherUserOrReadOnly, )

    def get_queryset(self):
        queryset = self.queryset
        status_param = self.request.query_params.get('status', None)
        course_param = self.request.query_params.get('course', None)

        if course_param:
            queryset = queryset.filter(course=course_param)

        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        meeting_data = []
        for meeting in queryset:
            presentors = meeting.presentors.all()
            criterias = MeetingCriteria.objects.filter(meeting=meeting)
            comments = meeting.comments.all()

            presentors_serializer = PitchSerializer(presentors, many=True)
            criteria_serializer = MeetingCriteriaSerializer(criterias, many=True)
            comment_serializer = CommentSerializer(comments, many=True)

            meeting_serializer = self.get_serializer(meeting)
            meeting = meeting_serializer.data

            meeting['pitches'] = presentors_serializer.data
            meeting['criteria'] = criteria_serializer.data
            meeting['comments'] = comment_serializer.data
            meeting_data.append(meeting)

        return Response(meeting_data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def add_meeting_presentor(self, request, pk=None):
        meeting = self.get_object()
        pitch_id = request.data.get('pitch')

        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            pitch = Pitch.objects.get(id=pitch_id)  # Assuming you have a Pitch model
            if pitch in meeting.presentors.all():
                return Response({'error': 'Presentor is already added to the meeting'}, status=status.HTTP_400_BAD_REQUEST)
            
            meeting.presentors.add(pitch)
            meeting.save()

            return Response(PitchSerializer(pitch).data, status=status.HTTP_201_CREATED)
        except Pitch.DoesNotExist:
            return Response({'error': 'Pitch not found'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['get'])
    def get_meeting_presentors(self, request, pk=None):
        meeting = self.get_object()
        
        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        presentors = meeting.presentors.all()

        if not presentors.exists():
            return Response({'error': 'No presentors found for the meeting.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PitchSerializer(presentors, many=True)  # Assuming you have a PitchSerializer

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def add_meeting_criteria(self, request, pk=None):
        meeting = self.get_object()  # Get the Meeting instance
        criteria_id = request.data.get('criteria')
        weight = request.data.get('weight')

        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            criteria = Criteria.objects.get(id=criteria_id)

            existing_criteria = MeetingCriteria.objects.filter(meeting=meeting, criteria=criteria)

            if existing_criteria.exists():
                return Response({'error': 'Criteria is already added to the meeting'}, status=status.HTTP_400_BAD_REQUEST)
            
            meeting_criteria = MeetingCriteria.objects.create(meeting=meeting, criteria=criteria, weight=weight)

            return Response(MeetingCriteriaSerializer(meeting_criteria).data, status=status.HTTP_201_CREATED)
        except Criteria.DoesNotExist:
            return Response({'error': 'Criteria not found'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['get'])
    def get_meeting_criteria(self, request, pk=None):
        meeting = self.get_object()
        
        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        criterias = MeetingCriteria.objects.filter(meeting=meeting)

        if not criterias.exists():
            return Response({'error': 'No criteria found for the meeting.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetingCriteriaSerializer(criterias, many=True) 

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def add_meeting_comment(self, request, pk=None):
        meeting = self.get_object()  # Get the Meeting instance

        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        comment_serializer = CommentSerializer(data=request.data)

        if comment_serializer.is_valid(): 
            comment_serializer.save()
            return Response(comment_serializer.data, status=status.HTTP_201_CREATED)
        return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['get'])
    def get_meeting_comments(self, request, pk=None):
        meeting = self.get_object()
        
        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        comments = meeting.comments.all()

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    