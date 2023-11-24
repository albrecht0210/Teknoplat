from rest_framework import permissions, viewsets
from ..models import Chat
from .serializers import ChatSerializer

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        meeting_param = self.request.query_params.get('meeting', None)

        if meeting_param:
            queryset = queryset.filter(meeting=meeting_param)

        return queryset