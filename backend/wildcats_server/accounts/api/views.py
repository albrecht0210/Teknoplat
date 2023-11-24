from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from wildcats_server.helper import request_to_callback_url
from ..models import Account
from .serializers import AccountSerializer
from ..permissions import IsAdminOrReadOnly, IsOwner
from services.models import Service, Connection
from services.api.serializers import ConnectionSerializer

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly, )

    def add_service_to_account(self, account_data, service_data):
        response = request_to_callback_url(
            authenticated_user=self.request.user, 
            account=account_data, 
            callback_url=service_data.callback_url,
            identifier=service_data.identifier    
        )

        error_response_map = [500, 400, 401, 403, 404]

        if response.status_code in error_response_map:
            return False
        return True

    def create(self, request, *args, **kwargs):
        account_serializer = self.get_serializer(data=request.data)
        services = Service.objects.all()

        if account_serializer.is_valid():
            account = account_serializer.save()

            for service in services:
                if self.add_service_to_account(account, service):
                    Connection.objects.create(account=account, service=service)
                else:
                    account.delete()
                    return Response({'error': 'Failed to associate services with the account'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(account_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(account_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_services(self, request, pk=None):
        account = self.get_object()
        connection = Connection.objects.filter(account=account)
        connection_serializer = ConnectionSerializer(connection, many=True)
        return Response(connection_serializer.data, status=status.HTTP_200_OK)
    
class AccountProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner, )

    def get_object(self):
        return self.request.user