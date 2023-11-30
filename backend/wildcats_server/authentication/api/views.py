import datetime
from django.conf import settings
import jwt
from rest_framework import permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import WildcatTokenObtainPairSerializer

PUBLIC_KEY = open(settings.JWT_PUBLIC_KEY_PATH).read()

# Create your views here.
class PublicKeyAPIView(views.APIView):
    def get(self, request):
        return Response({'public_key': PUBLIC_KEY})
    
class WildcatTokenObtainPairView(TokenObtainPairView):
    serializer_class = WildcatTokenObtainPairSerializer