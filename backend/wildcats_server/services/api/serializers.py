from rest_framework import serializers
from ..models import Service, Connection, Subscription

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name', 'identifier', 'callback_url')

class ConnectionSerializer(serializers.ModelSerializer):
    account = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ('id', 'account', 'service')

    def get_account(self, obj):
        return obj.account.full_name
    
    def get_service(self, obj):
        return obj.service.name
    
class SubscriptionSerializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField()
    organization = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = ('id', 'service', 'organization')

    def get_service(self, obj):
        return obj.service.name
    
    def get_organization(self, obj):
        return obj.organization.name
