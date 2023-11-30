from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RatingViewSet, AccountRatingAPIView, PitchRatingAPIView

router = DefaultRouter()
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('', include(router.urls)),
    path('account/ratings/', AccountRatingAPIView.as_view(), name='account-ratings'),
    path('pitch/ratings/', PitchRatingAPIView.as_view(), name='pitch-ratings'),
]
