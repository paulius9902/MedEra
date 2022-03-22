from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from API.models import NewUser, Prescriptions
from API.serializers import PrescriptionSerializer, PrescriptionSerializerDepth
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q

class PrescriptionGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            prescriptions = Prescriptions.objects.all()
        else:
            prescriptions = Prescriptions.objects.filter(patient=user_serializer.data["patient"])
        prescriptions_serializer=PrescriptionSerializerDepth(prescriptions, many=True)
        return JsonResponse(prescriptions_serializer.data, safe=False)
    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        if(user_serializer.data["is_doctor"]) :
            prescription = JSONParser().parse(request)
            prescription['doctor'] = user_serializer.data["doctor"]
            prescription_serializer = PrescriptionSerializer(data = prescription)
            if prescription_serializer.is_valid():
                prescription_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            else:
                return JsonResponse(prescription_serializer.errors, safe=False, status=400)
        else:
            return HttpResponse('Neturite gydytojo teisių!', status=204)

class PrescriptionGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, prescription_id):
        try:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                prescription = Prescriptions.objects.filter(prescription_id=prescription_id).get()
            else:
                prescription = Prescriptions.objects.filter(Q(prescription_id=prescription_id) & Q(patient=user_serializer.data["patient"])).get()
        except Prescriptions.DoesNotExist:
            return HttpResponse('Receptas nerastas!', status=404)
        prescription_serializer = PrescriptionSerializerDepth(prescription, many=False)
        return JsonResponse(prescription_serializer.data, safe=False)
    def patch(self, request, prescription_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        try:
            if(user_serializer.data["is_doctor"]):
                prescription = Prescriptions.objects.filter(prescription_id=prescription_id).get()
            else:
                return HttpResponse('Receptą gali koreguoti tik gydytojas!', status=204)
        except Prescriptions.DoesNotExist:
            return HttpResponse('Receptas nerastas!', status=404)
        prescription_data = JSONParser().parse(request)
        prescription_serializer = PrescriptionSerializer(prescription, data = prescription_data, partial=True)
        
        if prescription_serializer.is_valid():
            prescription_serializer.save()
            return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
        return JsonResponse(prescription_serializer.errors, safe=False, status=400)

    def delete(self, request, prescription_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                prescription = Prescriptions.objects.filter(prescription_id=prescription_id).get()
            else:
                return HttpResponse('Receptą gali ištrinti tik gydytojas ir administratorius!', status=204)
        except Prescriptions.DoesNotExist:
            return HttpResponse('Receptas nerastas!', status=404)
        prescription.delete()
        return JsonResponse("Sėkmingai ištrinta!", safe=False)