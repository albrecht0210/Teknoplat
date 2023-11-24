from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Chat(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='sender')
    meeting = models.ForeignKey('meetings.Meeting', on_delete=models.CASCADE)

    message = models.TextField()

    to_account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, blank=True, related_name='tagged')
    all_account = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.message