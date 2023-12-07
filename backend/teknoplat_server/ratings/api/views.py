import json

from rest_framework import views, generics, permissions, status, viewsets
from rest_framework.response import Response

from ..models import Rating
from .serializers import RatingSerializer

from criteria.models import MeetingCriteria
from accounts.api.serializers import AccountSerializer
from meetings.models import Meeting
from pitches.api.serializers import PitchSerializer

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

class MeetingRatingOverallAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated, )
    
    def get(self, request, format=None):
        meeting_param = self.request.query_params.get('meeting', None)

        if meeting_param:
            meeting = Meeting.objects.get(id=meeting_param)
        else:
            return Response({'error', 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)

        pitches = meeting.presentors.all()
        print(pitches)
        try: 
            response_data = []
            for pitch in pitches:
                pitch_data = PitchSerializer(pitch).data
                
                ratings = Rating.objects.filter(pitch=pitch_data['id'], meeting=meeting_param)

                if not ratings.exists():
                    raise Rating.DoesNotExist
                
                currentAccount = ratings[0].account
                account = AccountSerializer(currentAccount).data
                totalScore = 0
                overall = 0
                data = []

                for rating in ratings:
                    meeting_criteria = MeetingCriteria.objects.get(meeting=meeting_param, criteria=rating.criteria)
                    if currentAccount != rating.account:
                        data.append({ 'account': account, 'total': totalScore })
                        if account['role'] == 'Teacher':
                            overall += totalScore * meeting.teacher_weight_score
                        else:
                            overall += totalScore * meeting.teacher_weight_score
                        totalScore = 0
                        currentAccount = rating.account
                        account = AccountSerializer(currentAccount).data
                        
                    totalScore += rating.rating * meeting_criteria.weight

                data.append({ 'account': account, 'total': totalScore })
                pitch_data['ratings'] = data
                pitch_data['overall'] = overall
                response_data.append(pitch_data)
            return Response(response_data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist:
            return Response({'error', 'Rating does not exists.'}, status=status.HTTP_404_NOT_FOUND)
