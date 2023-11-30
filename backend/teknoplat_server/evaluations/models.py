from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Evaluation(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    pitch = models.ForeignKey('pitches.Pitch', on_delete=models.CASCADE)

    remark = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.remark

class EvaluationCriteria(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)
    criteria = models.ForeignKey('criteria.Criteria', on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=3, decimal_places=2)
