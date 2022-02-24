from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from API.models import LaboratoryTests, NewUser
from API.serializers import LaboratoryTestSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q

class LaboratoryTestGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            laboratory_tests = LaboratoryTests.objects.all()
        else:
            laboratory_tests = LaboratoryTests.objects.filter(patient=user_serializer.data["patient"])
        laboratory_tests_serializer=LaboratoryTestSerializer(laboratory_tests, many=True)
        return JsonResponse(laboratory_tests_serializer.data, safe=False)
    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        if(user_serializer.data["is_doctor"]) :
            laboratory_test = JSONParser().parse(request)
            laboratory_test['doctor'] = user_serializer.data["doctor"]
            laboratory_test_serializer = LaboratoryTestSerializer(data = laboratory_test)
            if laboratory_test_serializer.is_valid():
                laboratory_test_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            else:
                return JsonResponse(laboratory_test_serializer.errors, safe=False, status=400)
        else:
            return HttpResponse('Neturite gydytojo teisių!', status=204)

class LaboratoryTestGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, test_id):
        try:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                laboratory_test = LaboratoryTests.objects.filter(test_id=test_id).get()
            else:
                laboratory_test = LaboratoryTests.objects.filter(Q(test_id=test_id) & Q(patient=user_serializer.data["patient"])).get()
        except LaboratoryTests.DoesNotExist:
            return HttpResponse('Paciento tyrimas nerastas!', status=404)
        laboratory_test_serializer = LaboratoryTestSerializer(laboratory_test, many=False)
        return JsonResponse(laboratory_test_serializer.data, safe=False)
    def patch(self, request, test_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        try:
            if(user_serializer.data["is_doctor"]):
                laboratory_test = LaboratoryTests.objects.filter(test_id=test_id).get()
            else:
                return HttpResponse('Paciento tyrimą gali koreguoti tik gydytojas!', status=204)
        except LaboratoryTests.DoesNotExist:
            return HttpResponse('Paciento tyrimas nerastas!', status=404)
        laboratory_test_data = JSONParser().parse(request)
        laboratory_test_serializer = LaboratoryTestSerializer(laboratory_test, data = laboratory_test_data, partial=True)
        
        if laboratory_test_serializer.is_valid():
            laboratory_test_serializer.save()
            return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
        return JsonResponse(laboratory_test_serializer.errors, safe=False, status=400)

    def delete(self, request, test_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                laboratory_test = LaboratoryTests.objects.filter(test_id=test_id).get()
            else:
                return HttpResponse('Paciento tyrimą gali ištrinti tik gydytojas ir administratorius!', status=204)
        except LaboratoryTests.DoesNotExist:
            return HttpResponse('Paciento tyrimas nerastas!', status=404)
        laboratory_test.delete()
        return JsonResponse("Sėkmingai ištrinta!", safe=False)