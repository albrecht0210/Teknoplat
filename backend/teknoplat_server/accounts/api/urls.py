from django.urls import path
from .views import AccountProfileAPIView, AccountCreateAPIView

urlpatterns = [
    path('account/profile/', AccountProfileAPIView.as_view(), name='account-profile'),
    path('account/create/', AccountCreateAPIView.as_view(), name='account-callback-url'),
]