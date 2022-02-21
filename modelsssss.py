# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Allergies(models.Model):
    allergy_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'allergies'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class Comments(models.Model):
    comment_id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField()
    text = models.CharField(max_length=500, blank=True, null=True)
    visit = models.ForeignKey('Visits', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comments'


class Diagnoses(models.Model):
    diagnosis_id = models.AutoField(primary_key=True)
    creation_date = models.DateField()
    description = models.CharField(max_length=500, blank=True, null=True)
    temperature = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    systolic_blood_pressure = models.IntegerField(blank=True, null=True)
    diastolic_blood_pressure = models.IntegerField(blank=True, null=True)
    heart_rate = models.IntegerField(blank=True, null=True)
    advice = models.CharField(max_length=200, blank=True, null=True)
    patient = models.ForeignKey('Patients', models.DO_NOTHING)
    visit = models.ForeignKey('Visits', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'diagnoses'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class DjangoSite(models.Model):
    domain = models.CharField(unique=True, max_length=100)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'django_site'


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


class LaboratoryTests(models.Model):
    test_id = models.AutoField(blank=True, null=True)
    test_date = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    value_text = models.CharField(max_length=100, blank=True, null=True)
    value_numeric = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    patient = models.ForeignKey('Patients', models.DO_NOTHING, blank=True, null=True)
    visit = models.ForeignKey('Visits', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'laboratory_tests'


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


class PatientsAllergies(models.Model):
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)
    allergy = models.ForeignKey(Allergies, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'patients_allergies'


class Prescriptions(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    medicine = models.CharField(max_length=100, blank=True, null=True)
    custom_usage = models.CharField(max_length=200, blank=True, null=True)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    diagnosis = models.ForeignKey(Diagnoses, models.DO_NOTHING, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'prescriptions'


class Rooms(models.Model):
    room_id = models.AutoField(primary_key=True)
    number = models.IntegerField()
    location = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rooms'


class TokenBlacklistBlacklistedtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    email = models.CharField(unique=True, max_length=254)
    first_name = models.CharField(max_length=150)
    start_date = models.DateTimeField()
    about = models.TextField()
    is_doctor = models.BooleanField()
    is_patient = models.BooleanField()
    is_active = models.BooleanField()
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING, blank=True, null=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class UsersGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    newuser = models.ForeignKey(Users, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_groups'
        unique_together = (('newuser', 'group'),)


class UsersUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    newuser = models.ForeignKey(Users, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_permissions'
        unique_together = (('newuser', 'permission'),)


class VisitStatuses(models.Model):
    status_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'visit_statuses'


class Visits(models.Model):
    start_date = models.DateTimeField()
    visit_id = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    creation_date = models.DateTimeField(blank=True, null=True)
    room = models.ForeignKey(Rooms, models.DO_NOTHING, blank=True, null=True)
    health_issue = models.CharField(max_length=500, blank=True, null=True)
    status = models.ForeignKey(VisitStatuses, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'visits'


class WorkHours(models.Model):
    work_hours_id = models.AutoField(primary_key=True)
    week_day = models.IntegerField()
    start_time = models.TextField(blank=True, null=True)
    end_time = models.TextField(blank=True, null=True)
    doctor = models.ForeignKey(Doctors, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'work_hours'
