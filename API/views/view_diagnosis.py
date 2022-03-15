from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from API.models import Diagnoses, NewUser
from API.serializers import DiagnosisSerializer, DiagnosisSerializerDepth
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q

class DiagnosisGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            diagnoses = Diagnoses.objects.all()
        else:
            diagnoses = Diagnoses.objects.filter(patient=user_serializer.data["patient"])
        diagnoses_serializer=DiagnosisSerializerDepth(diagnoses, many=True)
        return JsonResponse(diagnoses_serializer.data, safe=False)
    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        if(user_serializer.data["is_doctor"]) :
            diagnosis = JSONParser().parse(request)
            diagnosis['doctor'] = user_serializer.data["doctor"]
            diagnosis_serializer = DiagnosisSerializer(data = diagnosis)
            if diagnosis_serializer.is_valid():
                diagnosis_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            else:
                return JsonResponse(diagnosis_serializer.errors, safe=False, status=400)
        else:
            return HttpResponse('Neturite gydytojo teisių!', status=403)

class DiagnosisGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, diagnosis_id):
        try:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                diagnosis = Diagnoses.objects.filter(diagnosis_id=diagnosis_id).get()
            else:
                diagnosis = Diagnoses.objects.filter(Q(diagnosis_id=diagnosis_id) & Q(patient=user_serializer.data["patient"])).get()
        except Diagnoses.DoesNotExist:
            return HttpResponse('Paciento diagnozė nerasta!', status=404)
        diagnosis_serializer = DiagnosisSerializerDepth(diagnosis, many=False)
        return JsonResponse(diagnosis_serializer.data, safe=False)
    def patch(self, request, diagnosis_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        try:
            if(user_serializer.data["is_doctor"]):
                diagnosis = Diagnoses.objects.filter(diagnosis_id=diagnosis_id).get()
            else:
                return HttpResponse('Paciento diagnozę gali koreguoti tik gydytojas!', status=204)
        except Diagnoses.DoesNotExist:
            return HttpResponse('Paciento diagnozė nerasta!', status=404)
        diagnosis_data = JSONParser().parse(request)
        diagnosis_serializer = DiagnosisSerializer(diagnosis, data = diagnosis_data, partial=True)
        
        if diagnosis_serializer.is_valid():
            diagnosis_serializer.save()
            return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
        return JsonResponse(diagnosis_serializer.errors, safe=False, status=400)

    def delete(self, request, diagnosis_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                diagnosis = Diagnoses.objects.filter(diagnosis_id=diagnosis_id).get()
            else:
                return HttpResponse('Paciento diagnozę gali ištrinti tik gydytojas ir administratorius!', status=204)
        except Diagnoses.DoesNotExist:
            return HttpResponse('Paciento diagnozė nerasta!', status=404)
        diagnosis.delete()
        return JsonResponse("Sėkmingai ištrinta!", safe=False)