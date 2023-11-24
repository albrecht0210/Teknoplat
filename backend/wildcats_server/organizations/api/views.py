from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Organization
from .serializers import OrganizationSerializer
from services.models import Service, Subscription
from services.api.serializers import SubscriptionSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser, )

    def create(self, request, *args, **kwargs):
        services = Service.objects.all()
        organization_serializer = self.get_serializer(data=request.data)

        if organization_serializer.is_valid():
            organization = organization_serializer.save()

            for service in services:
                Subscription.objects.create(service=service, organization=organization)
            return Response(organization_serializer.data, status=status.HTTP_201_CREATED)
        return Response(organization_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['GET'])
    def get_subscriptions(self, request, pk=None):
        organization = self.get_object()
        subscriptions = Subscription.objects.filter(organization=organization)
        serializer = SubscriptionSerializer(subscriptions, many=True)  # Assuming you have a SubscriptionSerializer

        return Response(serializer.data, status=status.HTTP_200_OK)