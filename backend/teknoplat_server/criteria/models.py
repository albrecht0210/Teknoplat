from django.db import models

# Create your models here.
class Criteria(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
        
class MeetingCriteria(models.Model):
    meeting = models.ForeignKey('meetings.Meeting', on_delete=models.CASCADE)
    criteria = models.ForeignKey(Criteria, on_delete=models.CASCADE)
    weight = models.DecimalField(max_digits=3, decimal_places=2)
