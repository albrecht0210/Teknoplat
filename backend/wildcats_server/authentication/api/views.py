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
    
class WildcatGenerateVideoToken(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    VIDEOSDK_API_KEY  = "fad76f00-2b26-41ae-ab29-698c9d6ca4a1"
    VIDEOSDK_SECRET_KEY = "16af5ce994c657c13e80ec4aba564949f11d1ea267b941973187ecc0766a0bb8"
    
    def get(self, request, *args, **kwargs):
        expiration_in_seconds = 600
        expiration = datetime.datetime.now() + datetime.timedelta(seconds=expiration_in_seconds)
        token = jwt.encode(payload={
            'exp': expiration,
            'apikey': self.VIDEOSDK_API_KEY,
            'permissions': ["allow_join", "allow_mod"],
        }, key=self.VIDEOSDK_SECRET_KEY, algorithm="HS256")

        return Response(token, status=status.HTTP_200_OK)