# Generated by Django 4.0.1 on 2022-02-24 10:46

import django.contrib.auth.models
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Allergies',
            fields=[
                ('allergy_id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(blank=True, max_length=200, null=True)),
            ],
            options={
                'db_table': 'allergies',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('comment_id', models.AutoField(primary_key=True, serialize=False)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('text', models.CharField(max_length=500)),
            ],
            options={
                'db_table': 'comments',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Diagnoses',
            fields=[
                ('diagnosis_id', models.IntegerField(primary_key=True, serialize=False)),
                ('creation_date', models.DateField()),
                ('description', models.CharField(blank=True, max_length=500, null=True)),
                ('temperature', models.DecimalField(blank=True, decimal_places=65535, max_digits=65535, null=True)),
                ('systolic_blood_pressure', models.IntegerField(blank=True, null=True)),
                ('diastolic_blood_pressure', models.IntegerField(blank=True, null=True)),
                ('heart_rate', models.IntegerField(blank=True, null=True)),
                ('advice', models.CharField(blank=True, max_length=200, null=True)),
            ],
            options={
                'db_table': 'diagnoses',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Doctors',
            fields=[
                ('doctor_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('surname', models.CharField(max_length=50)),
                ('birthday', models.DateField(blank=True, null=True)),
                ('gender', models.CharField(max_length=1)),
                ('phone_number', models.CharField(max_length=15)),
                ('specialization', models.CharField(max_length=50)),
                ('termination_date', models.DateField(blank=True, null=True)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_update_date', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'doctors',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='LaboratoryTests',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_id', models.IntegerField(blank=True, null=True)),
                ('test_date', models.DateTimeField(blank=True, null=True)),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('value_text', models.CharField(blank=True, max_length=100, null=True)),
                ('value_numeric', models.DecimalField(blank=True, decimal_places=65535, max_digits=65535, null=True)),
            ],
            options={
                'db_table': 'laboratory_tests',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Patients',
            fields=[
                ('patient_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('surname', models.CharField(max_length=50)),
                ('birthday', models.DateField()),
                ('gender', models.CharField(max_length=1)),
                ('phone_number', models.CharField(max_length=15)),
                ('height', models.IntegerField(blank=True, null=True)),
                ('weight', models.IntegerField(blank=True, null=True)),
                ('termination_date', models.DateField(blank=True, null=True)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_update_date', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'patients',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PatientsAllergies',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'patients_allergies',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Prescriptions',
            fields=[
                ('prescription_id', models.IntegerField(primary_key=True, serialize=False)),
                ('medicine', models.CharField(blank=True, max_length=100, null=True)),
                ('custom_usage', models.CharField(blank=True, max_length=200, null=True)),
                ('quantity', models.DecimalField(blank=True, decimal_places=65535, max_digits=65535, null=True)),
            ],
            options={
                'db_table': 'prescriptions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Rooms',
            fields=[
                ('room_id', models.AutoField(primary_key=True, serialize=False)),
                ('number', models.IntegerField(unique=True)),
                ('location', models.CharField(blank=True, max_length=500, null=True)),
            ],
            options={
                'db_table': 'rooms',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Visits',
            fields=[
                ('start_date', models.DateTimeField()),
                ('visit_id', models.AutoField(primary_key=True, serialize=False)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('health_issue', models.CharField(max_length=500)),
            ],
            options={
                'db_table': 'visits',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='VisitStatuses',
            fields=[
                ('status_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'visit_statuses',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='WorkHours',
            fields=[
                ('work_hours_id', models.AutoField(primary_key=True, serialize=False)),
                ('week_day', models.IntegerField()),
                ('start_time', models.TextField(blank=True, null=True)),
                ('end_time', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'work_hours',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='NewUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=150, unique=True)),
                ('start_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('about', models.TextField(blank=True, max_length=500, verbose_name='about')),
                ('is_doctor', models.BooleanField(default=False)),
                ('is_patient', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'users',
                'managed': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]