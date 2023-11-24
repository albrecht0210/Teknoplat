from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Evaluation, EvaluationCriteria
from .serializers import EvaluationSerializer, EvaluationCriteriaSerializer

from criteria.models import Criteria
from criteria.api.serializers import CriteriaSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = (permissions.IsAuthenticated, )

    @action(detail=True, methods=['post'])
    def add_evaluation_criteria(self, request, pk=None):
        evaluation = self.get_object()
        criteria_id = request.data.get('criteria')
        value = request.data.get('value')

        if evaluation is None:
            return Response({'error': 'Evaluation not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            criteria = Criteria.objects.get(id=criteria_id)

            existing_criteria = EvaluationCriteria.objects.filter(evaluation=evaluation, criteria=criteria)

            if existing_criteria.exists():
                return Response({'error': 'Criteria is already added to the evaluation'}, status=status.HTTP_400_BAD_REQUEST)
            
            evaluation_criteria = EvaluationCriteria.objects.create(evaluation=evaluation, criteria=criteria, value=value)

            return Response(EvaluationCriteriaSerializer(evaluation_criteria).data, status=status.HTTP_201_CREATED)
        except Criteria.DoesNotExist:
            return Response({'error': 'Criteria not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['put'])
    def update_evaluation_criteria(self, request, pk=None):
        evaluation = self.get_object()
        criteria_id = request.data.get('criteria')
        value = request.data.get('value')

        if evaluation is None:
            return Response({'error': 'Evaluation not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            criteria = Criteria.objects.get(id=criteria_id)

            evaluation_criteria = EvaluationCriteria.objects.get(evaluation=evaluation, criteria=criteria)
            
            evaluation_criteria.value = value
            evaluation_criteria.save()

            return Response(EvaluationCriteriaSerializer(evaluation_criteria).data, status=status.HTTP_201_CREATED)
        except Criteria.DoesNotExist:
            return Response({'error': 'Criteria not found'}, status=status.HTTP_404_NOT_FOUND)
        except EvaluationCriteria.DoesNotExist:
            return Response({'error': 'Criteria is not in the evaluation'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def get_evaluation_criteria(self, request, pk=None):
        evaluation = self.get_object()
        
        if evaluation is None:
            return Response({'error': 'Evaluation not found.'}, status=status.HTTP_404_NOT_FOUND)

        criterias = EvaluationCriteria.objects.filter(evaluation=evaluation)

        if not criterias.exists():
            return Response({'error': 'No criteria found for the evaluation.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EvaluationCriteriaSerializer(criterias, many=True)  # Assuming you have a PitchSerializer

        return Response(serializer.data, status=status.HTTP_200_OK)

