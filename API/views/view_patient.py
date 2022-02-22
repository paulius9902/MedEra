from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.models import Patients, NewUser
from API.serializers import PatientSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q

class PatientGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patients = Patients.objects.all()
            patients_serializer = PatientSerializer(patients, many=True)
        else:
            patients = Patients.objects.filter(patient_id=user_serializer.data["patient"])
            patients_serializer = PatientSerializer(patients, many=True)
        return JsonResponse(patients_serializer.data, safe=False)
    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patient_data = JSONParser().parse(request)
            patient_serializer = PatientSerializer(data = patient_data)
            if patient_serializer.is_valid():
                patient_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(patient_serializer.errors,safe=False)
        else:
            return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204)

class PatientGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, patient_id):
        try:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                patient = Patients.objects.get(patient_id=patient_id)
            else:
                patient = Patients.objects.filter(Q(patient_id=user_serializer.data["patient"]) & Q(patient_id=patient_id)).get()
        except Patients.DoesNotExist:
            return HttpResponse('Pacientas nerastas arba neturite reikiamų teisių!', status=404)
        patient_serializer = PatientSerializer(patient, many=False)
        return JsonResponse(patient_serializer.data, safe=False)

    def patch(self, request, patient_id):
        try:
            patient = Patients.objects.get(patient_id=patient_id)
        except Patients.DoesNotExist:
            return HttpResponse('Pacientas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patient_data = JSONParser().parse(request)
            patient_serializer = PatientSerializer(patient, data = patient_data, partial=True)
            if patient_serializer.is_valid():
                patient_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(patient_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204)

    def delete(self, request, patient_id):
        try:
            patient = Patients.objects.get(patient_id=patient_id)
        except Patients.DoesNotExist:
            return HttpResponse('Pacientas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patient.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204)