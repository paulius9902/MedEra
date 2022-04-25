from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status

class PatientListViewTest(TestCase):
    def test_patient_url_exists(self):
        response = self.client.get("/api/patient")
        self.assertEqual(response.status_code, 401)
        print('test_patient_url_exists OK')

    def test_patient_url_accessible_by_name(self):
        response = self.client.get(reverse('patient_list'))
        self.assertEqual(response.status_code, 401)
        print('test_patient_url_accessible_by_name OK')

class DoctorListViewTest(TestCase):
    def test_doctor_url_exists(self):
        response = self.client.get("/api/doctor")
        self.assertEqual(response.status_code, 401)
        print('test_doctor_url_exists OK')

    def test_doctor_url_accessible_by_name(self):
        response = self.client.get(reverse('doctor_list'))
        self.assertEqual(response.status_code, 401)
        print('test_doctor_url_accessible_by_name OK')

class VisitListViewTest(TestCase):
    def test_visit_url_exists(self):
        response = self.client.get("/api/visit")
        self.assertEqual(response.status_code, 401)
        print('test_visit_url_exists OK')

    def test_visit_url_accessible_by_name(self):
        response = self.client.get(reverse('visit_list'))
        self.assertEqual(response.status_code, 401)
        print('test_visit_url_accessible_by_name OK')