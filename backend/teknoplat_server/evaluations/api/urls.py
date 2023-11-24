from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EvaluationViewSet

router = DefaultRouter()
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('', include(router.urls)),

    path('evaluations/<int:pk>/add_evaluation_criteria/', EvaluationViewSet.as_view({'post': 'add_evaluation_criteria'}), name='add-evaluation-criteria'),
    path('evaluations/<int:pk>/update_evaluation_criteria/', EvaluationViewSet.as_view({'put': 'update_evaluation_criteria'}), name='put-evaluation-criteria'),
    path('evaluations/<int:pk>/get_evaluation_criteria/', EvaluationViewSet.as_view({'get': 'get_evaluation_criteria'}), name='get-evaluation-criteria'),
]
