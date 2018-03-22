import jwt
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse

from rest_framework.test import APITestCase
from config.urls import *
from decouple import config
from django.utils.encoding import smart_text

class UserLoginViewTestCase(APITestCase):
    url = reverse('get_user')
    def setUp(self):
        self.username = "tester"
        self.email = "tester@test.com"
        self.password = "tester123"
        self.user = User.objects.create_user(self.username, self.email, self.password)

        self.data = {
            'username': self.username,
            'password': self.password
        }

    def test_post_json_passing_jwt_auth(self):
        """
        Ensure POSTing form over JWT auth with correct credentials
        passes
        """
        payload = self.data
        token = jwt.encode(payload, config('SECRET_KEY'), algorithm=str(config('JWT_ALGORITHMS'))).decode('utf-8')
        auth = 'Bearer {0}'.format(token)
        response = self.client.post(
            self.url,
            content_type='application/json',
            HTTP_AUTHORIZATION=auth
        )

        self.assertEqual(response.status_code, 200)

    def test_post_json_failing_jwt_auth(self):
        """
        Ensure POSTing json over JWT auth without correct credentials fails
        """
        response = self.client.post(self.url, content_type='application/json')

        self.assertEqual(response.status_code, 403)

    def test_post_invalid_token_failing_jwt_auth(self):
        """
        Ensure POSTing over JWT auth with invalid token fails
        """
        auth = 'Bearer abc123'
        response = self.client.post(
            self.url,
            content_type='application/json',
            HTTP_AUTHORIZATION=auth
        )

        self.assertEqual(response.status_code, 403)

    def test_post_expired_token_failing_jwt_auth(self):
        """
        Ensure POSTing over JWT auth with expired token fails
        """
        payload = self.data
        payload['exp'] = 1
        token = jwt.encode(payload, config('SECRET_KEY'), algorithm=str(config('JWT_ALGORITHMS'))).decode('utf-8')

        auth = 'Bearer {0}'.format(token)
        response = self.client.post(
            self.url,
            content_type='application/json',
            HTTP_AUTHORIZATION=auth
        )

        self.assertEqual(response.status_code, 403)
