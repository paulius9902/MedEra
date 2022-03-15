from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.models import VisitStatuses, Visits, NewUser, Patients
from API.serializers import VisitSerializer, VisitSerializerDoctorPatient, PatientSerializer, VisitStatusSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q

class VisitGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            visits = Visits.objects.all()
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
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                visit = Visits.objects.filter(visit_id=visit_id).get()
            else:
                visit = Visits.objects.filter(Q(patient=user_serializer.data["patient"]) & Q(visit_id=visit_id)).get()
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas arba nesate vizito savininkas!', status=404)
        visit_serializer = VisitSerializer(visit, many=False)
        return JsonResponse(visit_serializer.data, safe=False)
    def patch(self, request, visit_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                visit = Visits.objects.filter(visit_id=visit_id).get()
            else:
                return HttpResponse('Neturite reikiamų teisių!', status=404)
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404)
        
        visit_data = JSONParser().parse(request)
        visit_serializer = VisitSerializer(visit, data = visit_data, partial=True)

        if visit_serializer.is_valid():
            visit_serializer.save()
            return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
        return JsonResponse(visit_serializer.errors, status=400, safe=False)
    def delete(self, request, visit_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                visit = Visits.objects.filter(visit_id=visit_id).get()
            else:
                visit = Visits.objects.filter(Q(patient=user_serializer.data["patient"]) & Q(visit_id=visit_id)).get()
            visit_serializer = VisitSerializer(visit)
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas arba neturite reikiamų teisių!', status=404)
        try:
            visit.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        except Patients.DoesNotExist:
            return JsonResponse("Nepavyko ištrinti!", safe=False)

class VisitStatusGetList(APIView):
    permission_classes = [IsAuthenticated,]
    def get(self, request):
        visit_statuses = VisitStatuses.objects.all()
        visit_statuses_serializer = VisitStatusSerializer(visit_statuses, many=True)
        return JsonResponse(visit_statuses_serializer.data, safe=False)
        

    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            visit_status_data = JSONParser().parse(request)
            visit_status_serializer = VisitStatusSerializer(data = visit_status_data)
            if visit_status_serializer.is_valid():
                visit_status_serializer.save()
                visit_status_serializer.data
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(visit_status_serializer.errors, status=400)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=403)
    
class VisitStatusGet(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request, status_id):
        try:
            status = VisitStatuses.objects.get(status_id=status_id)
        except VisitStatuses.DoesNotExist:
            return HttpResponse('Vizito statusas nerastas!', status=404)
        status_serializer = VisitStatusSerializer(status, many=False)
        return JsonResponse(status_serializer.data, safe=False)    

    def patch(self, request, status_id):
        try:
            status = VisitStatuses.objects.get(status_id=status_id)
        except VisitStatuses.DoesNotExist:
            return HttpResponse('Vizito statusas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            visit_status_data = JSONParser().parse(request)
            visit_status_serializer = VisitStatusSerializer(status, data = visit_status_data, partial=True)
            if visit_status_serializer.is_valid():
                visit_status_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(visit_status_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=403)

    def delete(self, request, status_id):
        try:
            visit_status_data = VisitStatuses.objects.get(status_id=status_id)
        except VisitStatuses.DoesNotExist:
            return HttpResponse('Vizito statusas nerastas!', status=404)

        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            visit_status_data.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=403)