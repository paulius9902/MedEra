from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.models import Allergies, Diagnoses, LaboratoryTests, Patients, NewUser, PatientsAllergies, Prescriptions, Visits
from API.serializers import AllergySerializer, DiagnosisSerializerDepth, LaboratoryTestSerializerDepth, PatientSerializer, PatientAllergySerializer, PrescriptionSerializerDepth, VisitSerializer, VisitSerializerDoctorPatient
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

class PatientAllergyGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request, patient_id):
        patient_allergy = JSONParser().parse(request)
        patient_allergy['patient'] = patient_id
        patient_allergy_serializer = PatientAllergySerializer(data = patient_allergy)
        
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        
        if patient_allergy_serializer.is_valid():
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]) :
                patient_allergy_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            else:
                return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204)
        return JsonResponse(patient_allergy_serializer.errors, safe=False, status=400)

class PatientAllergyGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def delete(self, request, patient_id, allergy_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                comment = PatientsAllergies.objects.filter(patient=patient_id, allergy=allergy_id).get()
            else:
                return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204)
        except PatientsAllergies.DoesNotExist:
            return HttpResponse('Paciento alergija nerasta!', status=404)
        comment.delete()
        return JsonResponse("Sėkmingai ištrinta!", safe=False)

class PatientVisitsGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, patient_id):
        visits = Visits.objects.filter(patient=patient_id)
        visits_serializer=VisitSerializerDoctorPatient(visits, many=True)
        return JsonResponse(visits_serializer.data, safe=False)

class PatientDiagnosisGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, patient_id):
        diagnoses = Diagnoses.objects.filter(patient=patient_id)
        diagnoses_serializer=DiagnosisSerializerDepth(diagnoses, many=True)
        return JsonResponse(diagnoses_serializer.data, safe=False)

class PatientLaboratoryTestGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, patient_id):
        laboratory_tests = LaboratoryTests.objects.filter(patient=patient_id)
        laboratory_tests_serializer=LaboratoryTestSerializerDepth(laboratory_tests, many=True)
        return JsonResponse(laboratory_tests_serializer.data, safe=False)

class PatientPrescriptionGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, patient_id):
        prescriptions = Prescriptions.objects.filter(patient=patient_id)
        prescriptions_serializer=PrescriptionSerializerDepth(prescriptions, many=True)
        return JsonResponse(prescriptions_serializer.data, safe=False)