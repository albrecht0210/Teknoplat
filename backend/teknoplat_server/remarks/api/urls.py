from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RemarkViewSet, AccountRemarkAPIView, PitchRemarkAPIView

router = DefaultRouter()
router.register(r'remarks', RemarkViewSet, basename='remark')

urlpatterns = [
    path('', include(router.urls)),
    path('account/remarks/', AccountRemarkAPIView.as_view(), name='account-remarks'),
    path('pitch/remarks/', PitchRemarkAPIView.as_view(), name='pitch-remarks'),
]
