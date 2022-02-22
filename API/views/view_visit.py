from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.models import Visits, NewUser, Patients
from API.serializers import VisitSerializer, VisitSerializerDoctorPatient, PatientSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse

class VisitGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            visits = Visits.objects.all()
            visits_serializer=VisitSerializerDoctorPatient(visits, many=True)
        else:
            visits = Visits.objects.filter(patient=user_serializer.data["patient"])
            visits_serializer=VisitSerializerDoctorPatient(visits, many=True)
        return JsonResponse(visits_serializer.data, safe=False)

    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if user_serializer.data["is_patient"]:
            visit = JSONParser().parse(request)
            visit['patient'] = user_serializer.data["patient"]
            visit_serializer = VisitSerializer(data = visit)
            if visit_serializer.is_valid():
                visit_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(visit_serializer.errors, safe=False, status=400)
        else:
            return HttpResponse('Vizitą gali pridėti tik pacientas!', status=404)

class VisitGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, visit_id):
        try:
            visit = Visits.objects.filter(visit_id=visit_id).get()
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404)
        visit_serializer = VisitSerializer(visit, many=False)
        return JsonResponse(visit_serializer.data, safe=False)
    def patch(self, request, visit_id):
        try:
            visit = Visits.objects.filter(visit_id=visit_id).get()
            visit_serializer_patient = VisitSerializer(visit)
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        visit_data = JSONParser().parse(request)
        visit_serializer = VisitSerializer(visit, data = visit_data, partial=True)

        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"] or patient_id==visit_serializer_patient.data["patient"]):
            if visit_serializer.is_valid():
                visit_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(visit_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus ar gydytojo teisių arba nesate šio įrašo savininkas!', status=204)
    def delete(self, request, visit_id):
        try:
            visit = Visits.objects.filter(visit_id=visit_id).get()
            visit_serializer = VisitSerializer(visit)
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0

        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"] or patient_id==visit_serializer.data["patient"]):
            visit.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus ar gydytojo teisių arba nesate šio vizito savininkas!', status=204)