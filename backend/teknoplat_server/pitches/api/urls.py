from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PitchViewSet, AccountPitchAPIView

router = DefaultRouter()
router.register(r'pitches', PitchViewSet, basename='pitch')

urlpatterns = [
    path('', include(router.urls)),
    # path('pitches/<int:pk>/get_team/', PitchViewSet.as_view({'get': 'get_team'}), name='get-team'),
    # path('pitches/<int:pk>/get_team_members/', PitchViewSet.as_view({'get': 'get_team_members'}), name='get-team-members'),
    path('account/pitch/', AccountPitchAPIView.as_view(), name='account-pitch')
]