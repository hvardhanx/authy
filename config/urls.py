"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views import generic
from rest_framework.views import APIView
from rest_framework.schemas import get_schema_view
from django.contrib.auth.models import User
from rest_framework import generics, serializers, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status, authentication, exceptions
from decouple import config
from rest_framework.permissions import IsAuthenticated
import json
import jwt

class UserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Get the username and password
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        if not username or not password:
            raise exceptions.AuthenticationFailed(('No credentials provided.'))

        credentials = {
            get_user_model().USERNAME_FIELD: username,
            'password': password
        }

        user = authenticate(**credentials)

        if user is None:
            raise exceptions.AuthenticationFailed(('Invalid username/password.'))

        if not user.is_active:
            raise exceptions.AuthenticationFailed(('User inactive or deleted.'))
        return (user, None)  # authentication successful


# Permissions
class AllowOnlyPOSTRequests(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # allow all POST requests
        if request.method == 'POST':
            return True
        else:
            return False

# Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password')

    def create(self, validated_data):
        user = super().create(validated_data)
        if 'password' in validated_data:
            user.set_password(validated_data['password'])
            user.save()
        return user


# Views
class UserView(APIView):
    queryset = User.objects.all()
    model = User
    permission_classes = (
        AllowOnlyPOSTRequests,
    )
    def get_queryset(self):
        qs = super(UserView, self).get_queryset()
        return qs.filter(username=self.kwargs['username'])
    
    def post(self, request, *args, **kwargs):
        authorization = request.META.get('HTTP_AUTHORIZATION', '')
        if authorization:
            auth_jwt = request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
            try:
                decoded = jwt.decode(auth_jwt, config('SECRET_KEY'), algorithms=[config('JWT_ALGORITHMS')])
            except Exception as e:
                return Response(status=status.HTTP_403_FORBIDDEN)
            user = User.objects.get(username=decoded['username'])
            return Response({ 'first_name': user.first_name })
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class RegisterView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

class LoginView(APIView):
    authentication_classes = (UserAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        content = {
            'user': request.user.username,
            'auth': request.auth,  # None
        }
        return Response(content)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', generic.RedirectView.as_view(url='/api/', permanent=False)),
    url(r'^api/$', get_schema_view(), name='api'),
    url(r'^api/users/login/$', LoginView.as_view(), name='login'),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/user(?:/(?P<username>\w+))*/$', UserView.as_view(), name='get_user'),
    url(r'^api/users/register/$', RegisterView.as_view(), name='register')
]
