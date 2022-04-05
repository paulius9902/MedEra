from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.models import Allergies, Doctors, Patients, NewUser, PatientsAllergies, Visits
from API.serializers import AllergySerializer, PatientSerializer, PatientAllergySerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q

class PatientGetCount(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        patient_count = Patients.objects.count()
        return HttpResponse(patient_count)

class DoctorGetCount(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        doctor_count = Doctors.objects.count()
        return HttpResponse(doctor_count)

class VisitGetCount(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        visit_count = Visits.objects.count()
        return HttpResponse(visit_count)

class UserGetCount(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user_count = NewUser.objects.count()
        return HttpResponse(user_count)