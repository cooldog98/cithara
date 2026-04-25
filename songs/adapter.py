from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth.models import User

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_auto_signup_allowed(self, request, sociallogin):
        return True
    
    def is_open_for_signup(self, request, sociallogin):
        return True

    def pre_social_login(self, request, sociallogin):
        if sociallogin.is_existing:
            return
        email = sociallogin.account.extra_data.get('email', '')
        username = email.split('@')[0] if email else 'user'
        # ถ้า username ซ้ำให้เพิ่มเลขต่อท้าย
        base = username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{i}"
            i += 1
        sociallogin.user.username = username

    def save_user(self, request, sociallogin, form=None):
        user = sociallogin.user
        if not user.username:
            email = user.email or ''
            user.username = email.split('@')[0] if email else 'user'
        user.set_unusable_password()
        user.save()
        return user