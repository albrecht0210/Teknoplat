from rest_framework import generics, permissions
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from ..models import Account
from .serializers import AccountSerializer
from ..permissions import IsOwner
from activity_management_server.permissions import IsWildcatAdmin

# Create your views here.
class AccountProfileAPIView(generics.RetrieveUpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner, )

    def get_object(self):
        return self.request.user

class AccountCreateAPIView(generics.CreateAPIView):
    authentication_classes = (JWTTokenUserAuthentication,)
    permission_classes = (permissions.IsAuthenticated, IsWildcatAdmin, )
    serializer_class = AccountSerializer
