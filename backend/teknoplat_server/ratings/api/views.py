from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response

from ..models import Rating
from .serializers import RatingSerializer

from pitches.models import Pitch

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated, )

class AccountRatingAPIView(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        meeting_param = self.request.query_params.get('meeting', None)
        if (meeting_param):
            try:
                queryset = Rating.objects.filter(account=self.request.user.id, meeting=meeting_param)
                if not queryset.exists():
                    raise Rating.DoesNotExist
                return queryset
            except Rating.DoesNotExist:
                return Response({'error', 'Rating does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error', 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)

class PitchRatingAPIView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        meeting_param = self.request.query_params.get('meeting', None)
        if (meeting_param):
            try:
                pitch = Pitch.objects.get(account=self.request.user.id)
                if not pitch.exists():
                    raise Pitch.DoesNotExist
                queryset = Rating.objects.filter(pitch=pitch.id, account=self.request.user.id, meeting=meeting_param)
                if not queryset.exists():
                    raise Rating.DoesNotExist
                return queryset
            except Rating.DoesNotExist:
                return Response({'error', 'Rating does not exists.'}, status=status.HTTP_404_NOT_FOUND)
            except Pitch.DoesNotExist:
                return Response({'error', 'Pitch does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error', 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)