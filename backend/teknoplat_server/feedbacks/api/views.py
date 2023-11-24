from rest_framework import permissions, viewsets
from ..models import Feedback
from .serializers import FeedbackSerializer
from teknoplat_server.permissions import IsTeacherUserOrReadOnly

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = (permissions.IsAuthenticated, IsTeacherUserOrReadOnly, )
    
    def get_queryset(self):
        queryset = self.queryset
        pitch_param = self.request.query_params.get('pitch', None)

        if pitch_param:
            queryset = queryset.filter(pitch=pitch_param)
        
        return queryset

