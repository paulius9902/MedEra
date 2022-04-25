import json
from django.test.client import Client
from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from rest_framework import status
from API import models
from django.contrib.auth import get_user_model
from parameterized import parameterized
from API.serializers import PatientSerializer

User = get_user_model()

class PatientTestCase(APITestCase):
    def test_patient_creation_unauthorized(self):
        payload = {
            "name": "Testas",
            "surname": "Testaitis"
        }
        
        response = self.client.post(reverse("patient_list"), payload)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        print('test_patient_creation_unauthorized OK')
    
    def test_patient_list(self):
        url = reverse('patient_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        print('test_patient_list OK')
    
    @parameterized.expand([
    ("admin@admin.com", "admin"),
    ("doctor@doctor.com", "doctor123"),
    ])
    def test_patient_list_authorized(self, email, password):
        url = reverse('patient_list')
        data = {
            'email': email,
            'password': password
        }
        tk_url = reverse('token_obtain_pair')
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        response = self.client.get(reverse('patient_detail', kwargs={'patient_id': 3}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #self.assertEqual(response.context['name'], 'Paulius')
        pat = models.Patients.objects.filter(patient_id=3).get()
        pat_serializer = PatientSerializer(pat) 
        self.assertEqual(pat_serializer.data["name"], 'Paulius')

        print('test_patient_list_authorized OK')

class DoctorTestCase(APITestCase):
    def test_doctor_creation_unauthorized(self):
        payload = {
            "name": "Jonas",
            "surname": "Jonaitis"
        }
        response = self.client.post(reverse("doctor_list"), payload)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        print('test_doctor_creation_unauthorized OK')
    
    def test_doctor_list(self):
        url = reverse('doctor_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        print('test_doctor_list OK')

class UserAuthTests(APITestCase):
    def test_obtain_token(self):
        data = {
            'email': 'admin@admin.com',
            'password': 'admin'
        }

        url = reverse('token_obtain_pair')
        
        resp = self.client.post(url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)
        print('test_obtain_token OK')

    def test_refresh_token(self):
        data = {
            'email': 'admin@admin.com',
            'password': 'admin'
        }

        obtain_url = reverse('token_obtain_pair')
        refresh_url = reverse('token_refresh')

        resp = self.client.post(obtain_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        data = {
            'refresh': token['refresh']
        }
        resp = self.client.post(refresh_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        refresh = resp.json()
        self.assertTrue('access' in refresh)
        print('test_refresh_token OK')

class UserTests(APITestCase):
    def test_user_list(self):
        url = reverse('user_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        print('test_user_list OK')

    def test_user_info(self):
        me_url = reverse('info')

        resp = self.client.get(me_url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

        data = {
            'email': 'admin@admin.com',
            'password': 'admin'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
        
        resp = self.client.get(me_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        user = resp.json()
        self.assertDictEqual(user,  
        {
            "id": 1,
            "email": "admin@admin.com",
            "last_login": "2021-12-14T23:16:24.471098",
            "is_superuser": True,
            "start_date": "2021-11-14T10:52:57.076384",
            "about": "",
            "is_doctor": False,
            "is_patient": False,
            "is_active": True,
            "doctor": None,
            "patient": None,
            "groups": [],
            "user_permissions": []
        })
        print('test_user_info OK')