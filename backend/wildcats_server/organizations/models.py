from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=100)
    identifier = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True, auto_created=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.identifier})'
