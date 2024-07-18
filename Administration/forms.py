from django import forms
from .models import Show

class ShowForm(forms.ModelForm):
    class Meta:
        model = Show
        fields = [
            'show_name',
            'sales_tax_percentage',
            'start_date',
            'end_date',
            'status',
            'description',
            'location'
        ]