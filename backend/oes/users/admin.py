from django.contrib import admin
from .models import User

from django.contrib.auth.admin import UserAdmin

# Register your models here.

from .models import User


# class CustomUserAdmin(UserAdmin):
#     model = User
#     fieldsets = (
#         *UserAdmin.fieldsets,
#         ("User type", {"fields": ["user_type"]}),
#     )


admin.site.register(User)
