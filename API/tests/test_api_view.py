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
    def setUp(self):
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
    def test_patient_list(self):
        url = reverse('patient_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_patient_list OK')
    
    def test_patient_get(self):
        url = reverse('patient_detail', kwargs={'patient_id':3})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_patient_get OK')

    def test_patient_patch(self):
        payload = {
            "name": "testas"
        }
        
        response = self.client.patch(reverse('patient_detail', kwargs={'patient_id':3}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_patch OK')
    def test_patient_post(self):
        payload = {
                "name": "Antanas",
                "surname": "Antanaitis1",
                "birthday": "1981-05-05",
                "gender": "V",
                "phone_number": "123456789",
                "image": "test",
                "personal_code": "12345678912",
                "full_name": "Antanas Antanaitis1"
        }
        
        response = self.client.post(reverse('patient_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_post OK')
    def test_patient_delete(self):        
        response = self.client.delete(reverse('patient_detail', kwargs={'patient_id':3}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_delete OK')
    
    def test_patient_allergy_post(self):
        payload = {
                "allergy": "18"
        }
        
        response = self.client.post(reverse('patient_allergy_list', kwargs={'patient_id':3}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_allergy_post OK')
    
    def test_patient_allergy_detail(self):        
        response = self.client.delete(reverse('patient_allergy_detail', kwargs={'patient_id':3, 'allergy_id':16}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_allergy_detail OK')

    def test_patient_visit_list(self):        
        response = self.client.get(reverse('patient_visit_list', kwargs={'patient_id':3}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_visit_list OK')
    
    def test_patient_diagnosis_list(self):        
        response = self.client.get(reverse('patient_diagnosis_list', kwargs={'patient_id':3}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_diagnosis_list OK')

    def test_patient_lab_test_list(self):        
        response = self.client.get(reverse('patient_lab_test_list', kwargs={'patient_id':3}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_lab_test_list OK')

    def test_patient_prescription_list(self):        
        response = self.client.get(reverse('patient_prescription_list', kwargs={'patient_id':3}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_prescription_list OK')

class DoctorTestCase(APITestCase):
    def setUp(self):
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
    def test_doctor_list(self):
        url = reverse('doctor_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_doctor_list OK')
    
    def test_doctor_get(self):
        url = reverse('doctor_detail', kwargs={'doctor_id':23})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_doctor_get OK')

    def test_doctor_patch(self):
        payload = {
            "specialization": "testas"
        }
        
        response = self.client.patch(reverse('doctor_detail', kwargs={'doctor_id':23}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_doctor_patch OK')
    def test_doctor_post(self):
        payload = {
                "name": "Antanas",
                "surname": "Antanaitis1",
                "gender": "M",
                "phone_number": "123456789",
                "specialization": "Šeimos gydytojas",
                "image": "image",
                "full_name": "Antanas Antanaitis1"
        }
        
        response = self.client.post(reverse('doctor_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_doctor_post OK')
    def test_doctor_delete(self):        
        response = self.client.delete(reverse('doctor_detail', kwargs={'doctor_id':23}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_doctor_delete OK')

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

    def test_patient_reg(self):        
        response = self.client.get(reverse('patient_reg'))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_patient_reg OK')

    def test_user_reg(self):        
        response = self.client.get(reverse('user_reg'))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_user_reg OK')

class UserTests(APITestCase):
    def setUp(self):
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
    def test_user_list(self):
        url = reverse('user_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_user_list OK')
    
    def test_user_get(self):
        url = reverse('user_detail', kwargs={'user_id':1})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_user_get OK')

    def test_user_info(self):
        me_url = reverse('info')
        
        resp = self.client.get(me_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_user_info OK')
    def test_user_patch(self):
        payload = {
            "email": "paulius9902@gmail.com"
        }
        
        response = self.client.patch(reverse('user_detail', kwargs={'user_id':59}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_user_patch OK')
    def test_user_post(self):
        payload = {
            "email": "pnvggdfgtergdfg@patient.com",
            "password":"patient12345"
        }
        
        response = self.client.post(reverse('user_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_user_post OK')
    def test_user_delete(self):        
        response = self.client.delete(reverse('user_detail', kwargs={'user_id':77}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_user_delete OK')

class DashboardTests(APITestCase):
    def setUp(self):
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
    def test_patient_count(self):
        url = reverse('patient_count')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_patient_count OK')
    def test_doctor_count(self):
        url = reverse('doctor_count')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_doctor_count OK')
    def test_visit_count(self):
        url = reverse('visit_count')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_count OK')
    def test_user_count(self):
        url = reverse('user_count')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_user_count OK')

class DiagnosisTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_diagnosis_list(self):
        url = reverse('diagnosis_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_diagnosis_list OK')
    
    def test_diagnosis_get(self):
        url = reverse('diagnosis_detail', kwargs={'diagnosis_id':15})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_diagnosis_get OK')

    def test_diagnosis_patch(self):
        payload = {
            "description": "asd"
        }
        
        response = self.client.patch(reverse('diagnosis_detail', kwargs={'diagnosis_id':15}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_diagnosis_patch OK')
    def test_diagnosis_post(self):
        payload = {
            "description": "asd",
            "name": "name",
            "patient": 2
        }
        
        response = self.client.post(reverse('diagnosis_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_diagnosis_post OK')
    def test_diagnosis_delete(self):        
        response = self.client.delete(reverse('diagnosis_detail', kwargs={'diagnosis_id':15}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_diagnosis_delete OK')

class LaboratoryTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_laboratory_test_list(self):
        url = reverse('laboratory_test_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_laboratory_test_list OK')
    
    def test_laboratory_test_get(self):
        url = reverse('laboratory_test_detail', kwargs={'test_id':4})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_laboratory_test_get OK')

    def test_laboratory_test_patch(self):
        payload = {
            "name": "test1"
        }
        
        response = self.client.patch(reverse('laboratory_test_detail', kwargs={'test_id':4}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_laboratory_test_patch OK')
    def test_laboratory_test_post(self):
        payload = {
            "name": "test1",
            "value_text": "testas2",
            "value_numeric": "1",
            "patient": 2,
            "doctor": 2,
            "test_date": "2022-04-16 08:00:00",
            "docfile": "docfile"
        }
        
        response = self.client.post(reverse('laboratory_test_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_laboratory_test_post OK')
    def test_laboratory_test_delete(self):        
        response = self.client.delete(reverse('laboratory_test_detail', kwargs={'test_id':4}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_laboratory_test_delete OK')

class AllergyTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_allergy_list(self):
        url = reverse('allergy_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_allergy_list OK')
    
    def test_allergy_get(self):
        url = reverse('allergy_detail', kwargs={'allergy_id':1})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_allergy_get OK')

class PrescriptionTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_prescription_list(self):
        url = reverse('prescription_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_prescription_list OK')
    
    def test_prescription_get(self):
        url = reverse('prescription_detail', kwargs={'prescription_id':14})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_prescription_get OK')

    def test_prescription_patch(self):
        payload = {
            "medicine": "test"
        }
        
        response = self.client.patch(reverse('prescription_detail', kwargs={'prescription_id':14}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_prescription_patch OK')
    def test_prescription_post(self):
        payload = {
            "medicine": "test",
            "patient": 4,
            "date":"2022-04-05 00:00:00"
        }
        
        response = self.client.post(reverse('prescription_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_prescription_post OK')
    def test_prescription_delete(self):        
        response = self.client.delete(reverse('prescription_detail', kwargs={'prescription_id':14}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_prescription_delete OK')

class VisitTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_visit_list(self):
        url = reverse('visit_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_list OK')
    
    def test_visit_get(self):
        url = reverse('visit_detail', kwargs={'visit_id':2})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_get OK')

    def test_visit_patch(self):
        payload = {
                "start_date": "2020-11-01T11:00:00"
        }
        
        response = self.client.patch(reverse('visit_detail', kwargs={'visit_id':2}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_visit_patch OK')
    def test_visit_delete(self):        
        response = self.client.delete(reverse('visit_detail', kwargs={'visit_id':2}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_visit_delete OK')

class VisitTestCasePatient(APITestCase):
    def setUp(self):
        data = {
            'email': 'patient@patient.com',
            'password': 'patient123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    
    def test_visit_post(self):
        payload = {
            "start_date": "2022-03-24T11:00:00",
            "doctor": 3,
            "room": 4,
            "health_issue": "Skauda galvą",
            "status": 2
        }
        
        response = self.client.post(reverse('visit_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_visit_post OK')

class VisitStatusTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_visit_status_list(self):
        url = reverse('status_list')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_status_list OK')
    
    def test_visit_status_get(self):
        url = reverse('status_detail', kwargs={'status_id':1})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_status_get OK')

    def test_visit_status_patch(self):
        payload = {
            "name": "TESTAS"
        }
        
        response = self.client.patch(reverse('status_detail', kwargs={'status_id':1}), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_visit_status_patch OK')
    def test_visit_status_post(self):
        payload = {
            "name": "TESTAS"
        }
        
        response = self.client.post(reverse('status_list'), data=payload, format='json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_visit_status_post OK')
    def test_visit_status_delete(self):        
        response = self.client.delete(reverse('status_detail', kwargs={'status_id':1}))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        print('test_visit_status_delete OK')

class VisitEmailTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")
    def test_confirm_visit(self):
        url = reverse('visit_confirm_email', kwargs={'visit_id':2})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_confirm_email OK')
    
    def test_cancel_visit(self):
        url = reverse('visit_cancel_email', kwargs={'visit_id':2})

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        print('test_visit_cancel_email OK')

class EmailTestCase(APITestCase):
    def setUp(self):
        data = {
            'email': 'doctor@doctor.com',
            'password': 'doctor123'
        }

        tk_url = reverse('token_obtain_pair')
        
        resp = self.client.post(tk_url, data=data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        token = resp.json()
        self.assertTrue('refresh' in token)
        self.assertTrue('access' in token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token['access']}")


    def test_change_password(self):
        data = {
            "old_password":"doctor123",
            "new_password":"doctor1234"
        }

        url = reverse('change_password')
        
        resp = self.client.put(url, data=data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        print('test_change_password OK')