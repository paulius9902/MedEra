from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.urls import reverse
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.        

class CustomAccountManager(BaseUserManager):

    def create_superuser(self, email, first_name, password, **other_fields):

        other_fields.setdefault('is_doctor', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_patient', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_doctor') is not True:
            raise ValueError(
                'Superuser must be assigned to is_doctor=True.')
        if other_fields.get('is_patient') is not True:
            raise ValueError(
                'Superuser must be assigned to is_patient=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')

        return self.create_user(email, first_name, password, **other_fields)

    def create_user(self, email, first_name, password, **other_fields):

        if not email:
            raise ValueError(_('You must provide an email address'))

        email = self.normalize_email(email)
        user = self.model(email=email,
                          first_name=first_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


class NewUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    about = models.TextField(_('about'), max_length=500, blank=True)
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    #doctor = models.ForeignKey(Doctors, models.DO_NOTHING, blank=True, null=True)
    #patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)


    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    class Meta:
        managed = False
        db_table = 'users'

    def __str__(self):
        return self.email

class Doctors(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    birthday = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    spacialization = models.CharField(max_length=50, blank=True, null=True)
    termination_date = models.DateField(blank=True, null=True)
    creation_date = models.DateField(blank=True, null=True)
    last_update_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'doctors'

    def get_absolute_url(self):
        return reverse("doctor_detail", args=[str(self.doctor_id)])

    def __str__(self):
        return f"Doctor: {self.name} {self.surname}"


class Patients(models.Model):
    patient_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    birthday = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    termination_date = models.DateField(blank=True, null=True)
    creation_date = models.DateField(blank=True, null=True)
    last_update_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'patients'

    def get_absolute_url(self):
        return reverse("patient_detail", args=[str(self.patient_id)])

    def __str__(self):
        return f"Patient: {self.name} {self.surname}"

class Rooms(models.Model):
    room_id = models.IntegerField(primary_key=True)
    number = models.IntegerField()
    location = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rooms'

class VisitStatuses(models.Model):
    status_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'visit_statuses'

class Visits(models.Model):
    start_date = models.DateTimeField()
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    visit_id = models.AutoField(primary_key=True)

    creation_date = models.DateTimeField(blank=True, null=True)
    room = models.ForeignKey(Rooms, models.DO_NOTHING, blank=True, null=True)
    health_issue = models.CharField(max_length=500, blank=True, null=True)
    status = models.ForeignKey(VisitStatuses, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visits'
        unique_together = (('start_date', 'doctor'),)

class Allergies(models.Model):
    allergy_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'allergies'
        
class PatientsAllergies(models.Model):
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)
    allergy = models.ForeignKey(Allergies, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'patients_allergies'

class Diagnoses(models.Model):
    diagnosis_id = models.IntegerField(primary_key=True)
    creation_date = models.DateField()
    description = models.CharField(max_length=500, blank=True, null=True)
    temperature = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    systolic_blood_pressure = models.IntegerField(blank=True, null=True)
    diastolic_blood_pressure = models.IntegerField(blank=True, null=True)
    heart_rate = models.IntegerField(blank=True, null=True)
    advice = models.CharField(max_length=200, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    visit = models.ForeignKey(Visits, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'diagnoses'

class Prescriptions(models.Model):
    prescription_id = models.IntegerField(primary_key=True)
    medicine = models.CharField(max_length=100, blank=True, null=True)
    custom_usage = models.CharField(max_length=200, blank=True, null=True)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    diagnosis = models.ForeignKey(Diagnoses, models.DO_NOTHING, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prescriptions'

class LaboratoryTests(models.Model):
    test_id = models.IntegerField(blank=True, null=True)
    test_date = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    value_text = models.CharField(max_length=100, blank=True, null=True)
    value_numeric = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)
    visit = models.ForeignKey(Visits, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'laboratory_tests'

class Comments(models.Model):
    comment_id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField()
    text = models.CharField(max_length=500, blank=True, null=True)
    visit = models.ForeignKey(Visits, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'comments'

class WorkHours(models.Model):
    work_hours_id = models.AutoField(primary_key=True)
    week_day = models.IntegerField()
    start_time = models.TextField(blank=True, null=True)
    end_time = models.TextField(blank=True, null=True)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'work_hours'
        unique_together = (('week_day', 'doctor'),)
