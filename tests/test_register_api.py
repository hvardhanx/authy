import json
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse

from rest_framework.test import APITestCase
from config.urls import *

class UserRegisterViewTestCase(APITestCase):
    url = reverse('register')

    def test_user_registration(self):
        """
        Test to verify that a post call with user valid data
        """
        user_data = {
            "username": "testuser",
            "email": "tester@test.com",
            "password": "tester123",
            "first_name": "Py",
            "last_name": "Tester"
        }

        response = self.client.post(self.url, user_data)
        self.assertEqual(201, response.status_code)

    def test_unique_username_validation(self):
        """
        Test to verify that a post call with already exists username
        """
        user_data_1 = {
            "username": "testuser",
            "email": "tester@test.com",
            "password": "tester123",
            "first_name": "Py",
            "last_name": "Tester"
        }
        response = self.client.post(self.url, user_data_1)
        self.assertEqual(201, response.status_code)

        user_data_2 = {
            "username": "testuser",
            "email": "tester@test.com",
            "password": "tester123",
            "first_name": "Python",
            "last_name": "Tester2"
        }
        response = self.client.post(self.url, user_data_2)
        self.assertEqual(400, response.status_code)
