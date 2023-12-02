from django.db import models

# Create your models here.
class Pitch(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    team = models.PositiveBigIntegerField()
    
    open_rate = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
