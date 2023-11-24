from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from wildcats_server.helper import request_to_callback_url
from ..models import Service, Connection
from .serializers import ServiceSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser, )
    
    def add_service_to_account(self, identifier, callback_url):
        response = request_to_callback_url(
            authenticated_user=self.request.user, 
            account=self.request.user, 
            callback_url=callback_url,
            identifier=identifier  
        )

        error_response_map = [500, 400, 401, 403, 404]

        if response.status_code in error_response_map:
            return False
        return True

    def create(self, request, *args, **kwargs):
        service_serializer = self.get_serializer(data=request.data)

        if service_serializer.is_valid():
            if self.add_service_to_account(identifier=self.request.data['identifier'], callback_url=self.request.data['callback_url']):
                service = service_serializer.save()
                Connection.objects.create(account=self.request.user, service=service)
            else:
                return Response({'error': 'Failed to associate services with the account'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(service_serializer.data, status=status.HTTP_201_CREATED)
        return Response(service_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        service = self.get_object()

        if self.add_service_to_account(identifier=service.identifier, callback_url=service.callback_url):
            Connection.objects.create(account=self.request.user, service=service)
        else:
            return Response({'error': 'Failed to associate services with the account'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Successfully registered account to service'}, status=status.HTTP_201_CREATED)

