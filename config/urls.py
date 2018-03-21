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
from rest_framework.schemas import get_schema_view
from django.contrib.auth.models import User
from rest_framework import generics, serializers, permissions
from rest_framework.response import Response
from rest_framework import status
from decouple import config
import jwt

# Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password')

# Views
class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    model = User
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    def get_queryset(self):
        qs = super(UserView, self).get_queryset()
        return qs.filter(username=self.kwargs['username'])
    
    def get(self, request, *args, **kwargs):
        authorization = request.META.get('HTTP_AUTHORIZATION', '')
        print("Auth: {}".format(authorization))
        if authorization:
            auth_jwt = request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
            print(auth_jwt)
            try:
                decoded = jwt.decode(auth_jwt, config('SECRET_KEY'), algorithms=['HS256'])
            except Exception as e:
                print("E: {}".format(e))
                return Response(status=status.HTTP_403_FORBIDDEN)
            return super().get(request, *args, **kwargs)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class RegisterView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', generic.RedirectView.as_view(url='/api/', permanent=False)),
    url(r'^api/$', get_schema_view(), name='api'),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/user/(?P<username>\w+)/$', UserView.as_view()),
    url(r'^api/users/register/$', RegisterView.as_view())
]
