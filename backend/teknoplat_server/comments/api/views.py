import re
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from ..models import Comment
from .serializers import CommentSerializer
from meetings.models import Meeting

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        meeting_param = self.request.query_params.get('meeting', None)

        if meeting_param:
            queryset = queryset.filter(meeting=meeting_param)

        return queryset
    
    def perform_create(self, serializer):
        instance = serializer.save()
        meeting_param = self.request.query_params.get('meeting', None)

        try:
            meeting = Meeting.objects.get(id=meeting_param)

            meeting.comments.add(instance)

            format_name = meeting.name.replace(' ', '_').lower()
            format_name = re.sub(r'[^a-z0-9_]', '', format_name)

            comment_data = CommentSerializer(instance=instance).data
            
            return Response(comment_data, status=status.HTTP_201_CREATED)
        except Meeting.DoesNotExist:
            return Response("Meeting not found", status=status.HTTP_404_NOT_FOUND)
            
