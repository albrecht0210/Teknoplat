from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Service(models.Model):
    name = models.CharField(max_length=100, unique=True)
    identifier = models.CharField(max_length=50, unique=True)
    callback_url = models.URLField()

    created_at = models.DateTimeField(auto_now_add=True, auto_created=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.identifier})'
    
class Connection(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True, auto_created=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['account', 'service']

    def __str__(self):
        return f'{self.account} | {self.service}'
    
class Subscription(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)    

    created_at = models.DateTimeField(auto_now_add=True, auto_created=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['service', 'organization']

    def __str__(self):
        return f"{self.service} | {self.organization}"