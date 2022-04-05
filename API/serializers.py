from django.db import models
from django.db.models import fields
from rest_framework import serializers
from API.models import Allergies, Comments, Diagnoses, Doctors, LaboratoryTests, Patients, Prescriptions, VisitStatuses, WorkHours, Visits, NewUser, PatientsAllergies
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patients
        #fields=('patient_id', 'name', 'surname', 'user_id')
        fields=('__all__')
        depth = 1

class PatientRegSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patients
        #fields=('patient_id', 'name', 'surname', 'user_id')
        fields=('patient_id', 'personal_code',)

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctors
        #fields=('doctor_id', 'name', 'surname', 'birth_date', 'user_id')
        fields=('__all__')

class WorkHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model=WorkHours
        #fields=('week_day', 'start_time', 'end_time', 'doctor', 'work_hours_id')
        fields=('__all__')

class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model=Visits
        #fields=('visit_id', 'start_date', 'doctor_id', 'patient_id')
        fields=('__all__')

class VisitSerializerDoctorPatient(serializers.ModelSerializer):
    class Meta:
        model=Visits
        #fields=('visit_id', 'start_date', 'doctor_id', 'patient_id')
        fields=('__all__')
        depth = 1

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comments
        fields=('__all__')

class VisitStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model=VisitStatuses
        fields=('__all__')

class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model=Allergies
        fields=('__all__')

class PatientAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model=PatientsAllergies
        fields=('__all__')

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model=Diagnoses
        fields=('__all__')

class DiagnosisSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model=Diagnoses
        fields=('__all__')
        depth = 1

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Prescriptions
        fields=('__all__')

class PrescriptionSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model=Prescriptions
        fields=('__all__')
        depth = 1

class LaboratoryTestSerializer(serializers.ModelSerializer):
    class Meta:
        model=LaboratoryTests
        fields=('__all__')

class LaboratoryTestSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model=LaboratoryTests
        fields=('__all__')
        depth = 1

class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = NewUser
        #fields = ('id', 'email', 'password', 'is_superuser', 'is_doctor', 'is_patient', 'first_name')
        fields=('__all__')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class CustomUserSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields=('__all__')
        depth = 1

class CustomUserRegSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields=('id', 'email',)

class ChangePasswordSerializer(serializers.Serializer):
    model = NewUser
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ResetPasswordEmailRequest(serializers.Serializer):
    email = serializers.EmailField(min_length=2)
    class Meta:
        fields = ['email']
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=64, write_only= True)
    token = serializers.CharField(min_length=1, write_only= True)
    uidb64 = serializers.CharField(min_length=1, write_only= True)
    class Meta:
        fields = ['password', 'token','uidb64']
    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            id = force_str(urlsafe_base64_decode(uidb64))
            user = NewUser.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The token is invalid', 401)
            user.set_password(password)
            user.save()
        except Exception as e:
            raise AuthenticationFailed('The token is invalid', 401)
        return super().validate(attrs)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        return token