from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django import forms
from django.db import models

from API.models import NewUser

class UserAdminConfig(UserAdmin):
    model = NewUser
    search_fields = ('email', )
    list_filter = ('email',  'is_active', 'is_doctor')
    ordering = ('-start_date',)
    list_display = ('email', 
                    'is_active', 'is_doctor')
    fieldsets = (
        (None, {'fields': ('email', )}),
        ('Permissions', {'fields': ('is_doctor', 'is_active')}),
        ('Personal', {'fields': ('about',)}),
    )
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
    }
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email',  'password1', 'password2', 'is_active', 'is_doctor')}
         ),
    )


admin.site.register(NewUser, UserAdminConfig)
