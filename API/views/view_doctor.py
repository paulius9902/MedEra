from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.models import Doctors, NewUser
from API.serializers import DoctorSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse

class DoctorGetList(APIView):
    #def get_permissions(self):
        #if self.request.method == 'GET':
            #self.permission_classes = [AllowAny, ]
        #else:
            #self.permission_classes = [IsAuthenticated, ]
        #return super(DoctorGetList, self).get_permissions()
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        doctors = Doctors.objects.all()
        doctors_serializer = DoctorSerializer(doctors, many=True)
        return JsonResponse(doctors_serializer.data, safe=False)

    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            doctor_data = JSONParser().parse(request)
            doctors_serializer = DoctorSerializer(data = doctor_data)
            if doctors_serializer.is_valid():
                doctors_serializer.save()
                doctors_serializer.data
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(doctors_serializer.errors, status=400)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=403)
    
class DoctorGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, doctor_id):
        try:
            doctor = Doctors.objects.get(doctor_id=doctor_id)
        except Doctors.DoesNotExist:
            return HttpResponse('Gydytojas nerastas!', status=404)
        doctors_serializer = DoctorSerializer(doctor, many=False)
        return JsonResponse(doctors_serializer.data, safe=False)

    def patch(self, request, doctor_id):
        try:
            doctor = Doctors.objects.get(doctor_id=doctor_id)
        except Doctors.DoesNotExist:
            return HttpResponse('Gydytojas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            doctor_data = JSONParser().parse(request)
            doctors_serializer = DoctorSerializer(doctor, data = doctor_data, partial=True)
            if doctors_serializer.is_valid():
                doctors_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(doctors_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=403)

    def delete(self, request, doctor_id):
        try:
            doctor = Doctors.objects.get(doctor_id=doctor_id)
        except Doctors.DoesNotExist:
            return HttpResponse('Gydytojas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            doctor.delete()
            return HttpResponse('Sėkmingai ištrinta!')
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=403)