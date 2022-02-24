from django.db import models
from django.db.models import fields
from rest_framework import serializers
from API.models import Allergies, Comments, Diagnoses, Doctors, LaboratoryTests, Patients, Prescriptions, Rooms, VisitStatuses, WorkHours, Visits, NewUser, PatientsAllergies

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Patients
        #fields=('patient_id', 'name', 'surname', 'user_id')
        fields=('__all__')
        depth = 1

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

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rooms
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

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Prescriptions
        fields=('__all__')

class LaboratoryTestSerializer(serializers.ModelSerializer):
    class Meta:
        model=LaboratoryTests
        fields=('__all__')

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
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

class ChangePasswordSerializer(serializers.Serializer):
    model = NewUser
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)