from django.db import models
from UoneR.models import User
# Create your models here.


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Show(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show_name = models.CharField(max_length=255, blank=True, null=True)
    sales_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    status = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.show_name or "Unnamed Show"