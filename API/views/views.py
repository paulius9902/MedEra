from django.shortcuts import render
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework import status
from django.http import Http404
from django.http import HttpResponse
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token
from API.serializers import ChangePasswordSerializer, CustomUserSerializer
from API.models import Comments, Doctors, NewUser, Patients, WorkHours, Visits
from API.serializers import CommentSerializer, PatientSerializer, DoctorSerializer, VisitSerializer, WorkHoursSerializer, VisitSerializerDoctorPatient
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from datetime import datetime

# Create your views here.

class UserGetList(APIView):
    permission_classes = [IsAuthenticated,]
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            users = NewUser.objects.all()
            users_serializer = CustomUserSerializer(users, many=True)
            return JsonResponse(users_serializer.data, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)
        

    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            user_data = JSONParser().parse(request)
            user_serializer = CustomUserSerializer(data = user_data)
            if user_serializer.is_valid():
                user_serializer.save()
                user_serializer.data
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(user_serializer.errors, status=400)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)
    
class UserGet(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request, user_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            try:
                user = NewUser.objects.get(id=user_id)
            except NewUser.DoesNotExist:
                return HttpResponse('Vartotojas nerastas!', status=404)
            user_serializer = CustomUserSerializer(user, many=False)
            return JsonResponse(user_serializer.data, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)
        

    def patch(self, request, user_id):
        try:
            user = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return HttpResponse('Vartotojas nerastas!', status=404)
        user_token = NewUser.objects.get(id=self.request.user.id)
        user_serializer_token = CustomUserSerializer(user_token)
        if(user_serializer_token.data["is_superuser"]):
            user_data = JSONParser().parse(request)
            user_serializer = CustomUserSerializer(user, data = user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(user_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)

    def delete(self, request, user_id):
        try:
            user_data = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return HttpResponse('Vartotojas nerastas!', status=404)

        if self.request.user.id != user_id:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"]):
                user_data.delete()
                return JsonResponse("Sėkmingai ištrinta!", safe=False)
            else:
                return HttpResponse('Neturite administratoriaus teisių!', status=204)
        else:
            return HttpResponse('Savęs ištrinti negalima!', status=204)

class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return JsonResponse("Sėkmingai atsijungta!",status=status.HTTP_200_OK, safe=False)
        except Exception as e:
            return JsonResponse("Nepavyko atsijungti!", status=status.HTTP_400_BAD_REQUEST, safe=False)

class ChangePasswordView(APIView):
    serializer_class = ChangePasswordSerializer
    model = NewUser
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return JsonResponse({"old_password": ["Wrong password"]}, status=status.HTTP_400_BAD_REQUEST, safe=False)
            self.object.set_password(serializer.data.get('new_password'))
            self.object.save()
            update_session_auth_hash(request, self.object)

            return JsonResponse("Slaptažodis sėkmingai pakeistas!",status=status.HTTP_200_OK, safe=False)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)

class UserView(APIView):
    serializer_class = CustomUserSerializer
    model = NewUser
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def get(self, request):
        obj = self.get_object()
        serializer = self.serializer_class(obj)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)