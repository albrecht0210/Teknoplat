from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from services.models import Connection, Service

class WildcatTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        user_connections = Connection.objects.filter(account=user)
        user_services = [Service.objects.get(pk=connection.service.pk) for connection in user_connections]
        service_identifiers = [service.identifier for service in user_services]
        
        print(service_identifiers)

        token['aud'] = service_identifiers
        token['admin'] = user.is_superuser

        return token 