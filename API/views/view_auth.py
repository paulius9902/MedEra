from rest_framework.views import APIView
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.serializers import ChangePasswordSerializer, CustomUserRegSerializer, CustomUserSerializer, PatientRegSerializer, PatientSerializer
from API.models import NewUser, Patients
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from rest_framework.parsers import JSONParser

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

class PatientGetListReg(APIView):
    def get(self, request):
        patients = Patients.objects.all()
        patients_serializer = PatientRegSerializer(patients, many=True)
        return JsonResponse(patients_serializer.data, safe=False)

class UserGetListReg(APIView):
    def get(self, request):
        users = NewUser.objects.all()
        users_serializer = CustomUserRegSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False)