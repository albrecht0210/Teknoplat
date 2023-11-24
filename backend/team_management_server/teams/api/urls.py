from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, AccountTeamAPIView

# Create a router for the CourseViewSet
router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    # Include the router's URL patterns
    path('', include(router.urls)),
    path('courses/<int:pk>/add_team_member/', TeamViewSet.as_view({'post': 'add_team_member'}), name='add-team-member'),
    path('courses/<int:pk>/get_team_members/', TeamViewSet.as_view({'get': 'get_team_members'}), name='get-team-members'),
    
    path('account/profile/teams', AccountTeamAPIView.as_view(), name='courses-by-account'),
]