from django.contrib import admin
from .models import Service, Connection, Subscription

# Register your models here.
admin.site.register(Service)
admin.site.register(Connection)
admin.site.register(Subscription)