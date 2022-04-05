from django.http import HttpResponse
from rest_framework.views import APIView
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from API.serializers import ChangePasswordSerializer, CustomTokenObtainPairSerializer, CustomUserRegSerializer, CustomUserSerializer, PatientRegSerializer, PatientSerializer, ResetPasswordEmailRequest, SetNewPasswordSerializer
from API.models import NewUser, Patients
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from rest_framework.parsers import JSONParser
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from ..utils import Util
from rest_framework.response import Response

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

class RequestPasswordResetEmail(APIView):
    serializer_class = ResetPasswordEmailRequest
    def post(self, request):
        email = request.data['email']
        if NewUser.objects.filter(email=email).exists():
            user = NewUser.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = 'http://localhost:3000'
            relativeLink = reverse('password_reset_confirm',kwargs={'uidb64':uidb64, 'token': token})
            absolute_url = 'http://'+current_site+relativeLink
            email_body = 'Hello, \n Use the link below to reset password for your account \n' + absolute_url
            subject = 'test'
            data = {'email_body': email_body, 'to_email': user.email, 'email_subject': subject}
            Util.send_email(data)
            return Response("Sėkmingai išsiųsta!")
            return Response({current_site})
        return Response({{{'success'}: 'We have sent a reset link in your email. Please check it out'}}, status=status.HTTP_200_OK)
        

class PasswordTokenViewAPI(APIView):
    serializer_class=CustomTokenObtainPairSerializer
    def get(self, request,uidb64,token):
        try:
            id=smart_str(urlsafe_base64_decode(uidb64))
            user = NewUser.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return HttpResponse({'error': 'Invalid Token. Request a new one'}, status=status.HTTP_401_UNAUTHORIZED)
            return HttpResponse({'success': True, 'message': 'Credentials Valid', 'uidb64':uidb64, 'token': token}, status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError:
                return HttpResponse({'error': 'Invalid Token. Please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)


class SetNewPasswordAPIView(APIView):
    serializer_class = SetNewPasswordSerializer
    def patch(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return HttpResponse({'success': True, 'message':'Password reset successful'}, status=status.HTTP_200_OK)