import json
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse

from rest_framework.test import APITestCase
from config.urls import *

class UserLoginViewTestCase(APITestCase):
    url = reverse('login')

    def setUp(self):
        self.username = "tester"
        self.email = "tester@test.com"
        self.password = "tester123"
        self.user = User.objects.create_user(self.username, self.email, self.password)

    def test_authentication_without_password(self):
        response = self.client.post(self.url, {"username": "tester"})
        self.assertEqual(403, response.status_code)

    def test_authentication_with_wrong_password(self):
        response = self.client.post(self.url, {"username": self.username, "password": "wrong_password"})
        self.assertEqual(403, response.status_code)

    def test_authentication_with_valid_data(self):
        response = self.client.post(self.url, {"username": self.username, "password": self.password})
        self.assertEqual(200, response.status_code)


class UserLogoutViewTestCase(APITestCase):
    url = '/api/auth/logout'

    def setUp(self):
        self.username = "tester"
        self.email = "tester@test.com"
        self.password = "tester123"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.api_authentication()

    def api_authentication(self):
        self.client.login(username=self.username, password=self.password)

    def test_logout(self):
        response = self.client.get(self.url)
        self.assertEqual(301, response.status_code)
