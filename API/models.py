from pickle import TRUE
from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.urls import reverse
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import UserManager

# Create your models here.        

class Doctors(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    birthday = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1)
    phone_number = models.CharField(max_length=15)
    specialization = models.CharField(max_length=50)
    termination_date = models.DateField(blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=timezone.now)
    last_update_date = models.DateTimeField(auto_now=timezone.now)
    room = models.IntegerField(blank=True, null=True)
    image = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'doctors'

class VisitStatuses(models.Model):
    status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'visit_statuses'

class Allergies(models.Model):
    allergy_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'allergies'

class Patients(models.Model):
    patient_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    birthday = models.DateField()
    gender = models.CharField(max_length=1)
    phone_number = models.CharField(max_length=15)
    height = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    termination_date = models.DateField(blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=timezone.now)
    last_update_date = models.DateTimeField(auto_now=timezone.now)
    allergies = models.ManyToManyField(Allergies, through="PatientsAllergies")
    image = models.CharField(max_length=100)
    personal_code = models.CharField(max_length=11)
    full_name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'patients'

class Visits(models.Model):
    start_date = models.DateTimeField()
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    visit_id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=timezone.now)
    health_issue = models.CharField(max_length=500)
    status = models.ForeignKey(VisitStatuses, models.DO_NOTHING)
    description = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visits'
        unique_together = (('start_date', 'doctor'),)

class PatientsAllergies(models.Model):
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    allergy = models.ForeignKey(Allergies, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'patients_allergies'
        unique_together = (('patient', 'allergy'),)

class Diagnoses(models.Model):
    diagnosis_id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=timezone.now)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    temperature = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    systolic_blood_pressure = models.IntegerField(blank=True, null=True)
    diastolic_blood_pressure = models.IntegerField(blank=True, null=True)
    heart_rate = models.IntegerField(blank=True, null=True)
    advice = models.CharField(max_length=200, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    visit = models.OneToOneField(Visits, models.DO_NOTHING, blank=True, null=True)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'diagnoses'

class Prescriptions(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    medicine = models.CharField(max_length=100)
    custom_usage = models.CharField(max_length=200, blank=True, null=True)
    quantity = models.CharField(max_length=50, blank=True, null=True)
    diagnosis = models.ForeignKey(Diagnoses, models.DO_NOTHING, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)
    date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'prescriptions'

class LaboratoryTests(models.Model):
    test_id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=timezone.now)
    name = models.CharField(max_length=200)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    visit = models.ForeignKey(Visits, models.DO_NOTHING, blank=True, null=True)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)
    test_date = models.DateTimeField()
    docfile = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'laboratory_tests'


class NewUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=150, unique=True)
    start_date = models.DateTimeField(default=timezone.now)
    about = models.TextField(_('about'), max_length=500, blank=True)
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)


    #objects = CustomAccountManager()
    objects = UserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        managed = False
        db_table = 'users'