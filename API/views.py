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

from API.models import Comments, Doctors, Patients, WorkHours, Visits
from API.serializers import CommentSerializer, PatientSerializer, DoctorSerializer, VisitSerializer, WorkHoursSerializer, VisitSerializerDoctorPatient
from users.models import NewUser
from users.serializers import CustomUserSerializer
from rest_framework.viewsets import ModelViewSet

from datetime import datetime

# Create your views here.

class DoctorGetList(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(DoctorGetList, self).get_permissions()

    def get(self, request):
        doctors = Doctors.objects.all()
        doctors_serializer = DoctorSerializer(doctors, many=True)
        return JsonResponse(doctors_serializer.data, safe=False)

    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            doctor_data = JSONParser().parse(request)
            doctors_serializer = DoctorSerializer(data = doctor_data)
            if doctors_serializer.is_valid():
                doctors_serializer.save()
                doctors_serializer.data
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(doctors_serializer.errors, status=400)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')
    
class DoctorGet(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(DoctorGet, self).get_permissions()

    def get(self, request, doctor_id):
        try:
            doctor = Doctors.objects.get(doctor_id=doctor_id)
        except Doctors.DoesNotExist:
            return HttpResponse('Gydytojas nerastas!', status=404, content_type='application/javascript')
        doctors_serializer = DoctorSerializer(doctor, many=False)
        return JsonResponse(doctors_serializer.data, safe=False)

    def patch(self, request, doctor_id):
        try:
            doctor = Doctors.objects.get(doctor_id=doctor_id)
        except Doctors.DoesNotExist:
            return HttpResponse('Gydytojas nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            doctor_data = JSONParser().parse(request)
            doctors_serializer = DoctorSerializer(doctor, data = doctor_data, partial=True)
            if doctors_serializer.is_valid():
                doctors_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(doctors_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')

    def delete(self, request, doctor_id):
        try:
            doctor = Doctors.objects.get(doctor_id=doctor_id)
        except Doctors.DoesNotExist:
            return HttpResponse('Gydytojas nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            doctor.delete()
            return HttpResponse('Sėkmingai ištrinta!', content_type='application/javascript')
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')

class DoctorWorkHoursList(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(DoctorWorkHoursList, self).get_permissions()

    def get(self, request, doctor_id):
        work_hours = WorkHours.objects.filter(doctor_id=doctor_id)
        work_hours_serializer=WorkHoursSerializer(work_hours, many=True)
        return JsonResponse(work_hours_serializer.data, safe=False)
    def post(self, request, doctor_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            work_hours = JSONParser().parse(request)
            work_hours['doctor'] = doctor_id
            work_hours_serializer = WorkHoursSerializer(data = work_hours)
            if work_hours_serializer.is_valid():
                work_hours_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(work_hours_serializer.errors, safe=False, status=400)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')

class DoctorWorkHours(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(DoctorWorkHours, self).get_permissions()

    def get(self, request, doctor_id, week_day):
        try:
            work_hours = WorkHours.objects.filter(doctor_id=doctor_id, week_day=week_day).get()
        except WorkHours.DoesNotExist:
            return HttpResponse('Darbo valandos nerastos!', status=404, content_type='application/javascript')
        work_hours_serializer = WorkHoursSerializer(work_hours, many=False)
        return JsonResponse(work_hours_serializer.data, safe=False)
    def patch(self, request, doctor_id, week_day):
        try:
            work_hours = WorkHours.objects.filter(doctor_id=doctor_id, week_day=week_day).get()
        except WorkHours.DoesNotExist:
            return HttpResponse('Darbo valandos nerastos!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            work_hours_data = JSONParser().parse(request)
            work_hours_serializer = WorkHoursSerializer(work_hours, data = work_hours_data, partial=True)
            if work_hours_serializer.is_valid():
                work_hours_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(work_hours_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')
    def delete(self, request, doctor_id, week_day):
        try:
            work_hours = WorkHours.objects.filter(doctor_id=doctor_id, week_day=week_day).get()
        except WorkHours.DoesNotExist:
            return HttpResponse('Darbo valandos nerastos!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            work_hours.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')

class PatientGetList(APIView):
    #def get_permissions(self):
        #if self.request.method == 'GET':
            #self.permission_classes = [AllowAny, ]
        #else:
            #self.permission_classes = [IsAuthenticated, ]
        #return super(PatientGetList, self).get_permissions()
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        patients = Patients.objects.all()
        patients_serializer = PatientSerializer(patients, many=True)
        return JsonResponse(patients_serializer.data, safe=False)
    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patient_data = JSONParser().parse(request)
            patient_serializer = PatientSerializer(data = patient_data)
            if patient_serializer.is_valid():
                patient_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(patient_serializer.errors,safe=False)
        else:
            return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204, content_type='application/javascript')

class PatientGet(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(PatientGet, self).get_permissions()

    def get(self, request, patient_id):
        try:
            patient = Patients.objects.get(patient_id=patient_id)
        except Patients.DoesNotExist:
            return HttpResponse('Pacientas nerastas!', status=404, content_type='application/javascript')
        patient_serializer = PatientSerializer(patient, many=False)
        return JsonResponse(patient_serializer.data, safe=False)

    def patch(self, request, patient_id):
        try:
            patient = Patients.objects.get(patient_id=patient_id)
        except Patients.DoesNotExist:
            return HttpResponse('Pacientas nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patient_data = JSONParser().parse(request)
            patient_serializer = PatientSerializer(patient, data = patient_data, partial=True)
            if patient_serializer.is_valid():
                patient_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(patient_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204, content_type='application/javascript')

    def delete(self, request, patient_id):
        try:
            patient = Patients.objects.get(patient_id=patient_id)
        except Patients.DoesNotExist:
            return HttpResponse('Pacientas nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            patient.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus arba gydytojo teisių!', status=204, content_type='application/javascript')

class VisitGetList(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(VisitGetList, self).get_permissions()

    def get(self, request):
        visits = Visits.objects.all()
        visits_serializer=VisitSerializerDoctorPatient(visits, many=True)
        return JsonResponse(visits_serializer.data, safe=False)
    def post(self, request):
        visit = JSONParser().parse(request)
        visit_serializer = VisitSerializer(data = visit)
        if visit_serializer.is_valid():
            visit_serializer.save()
            return JsonResponse("Sėkmingai pridėta!",safe=False)
        return JsonResponse(visit_serializer.errors, safe=False, status=400)

class VisitGet(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(VisitGet, self).get_permissions()
    def get(self, request, visit_id):
        try:
            visit = Visits.objects.filter(visit_id=visit_id).get()
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404, content_type='application/javascript')
        visit_serializer = VisitSerializer(visit, many=False)
        return JsonResponse(visit_serializer.data, safe=False)
    def patch(self, request, visit_id):
        try:
            visit = Visits.objects.filter(visit_id=visit_id).get()
            visit_serializer_patient = VisitSerializer(visit)
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        visit_data = JSONParser().parse(request)
        visit_serializer = VisitSerializer(visit, data = visit_data, partial=True)

        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"] or patient_id==visit_serializer_patient.data["patient"]):
            if visit_serializer.is_valid():
                visit_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(visit_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus ar gydytojo teisių arba nesate šio įrašo savininkas!', status=204, content_type='application/javascript')
    def delete(self, request, visit_id):
        try:
            visit = Visits.objects.filter(visit_id=visit_id).get()
            visit_serializer = VisitSerializer(visit)
        except Visits.DoesNotExist:
            return HttpResponse('Vizitas nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0

        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"] or patient_id==visit_serializer.data["patient"]):
            visit.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus ar gydytojo teisių arba nesate šio vizito savininkas!', status=204, content_type='application/javascript')

class CommentGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, visit_id):
        comments = Comments.objects.filter(visit=visit_id)
        comments_serializer=CommentSerializer(comments, many=True)
        return JsonResponse(comments_serializer.data, safe=False)
    def post(self, request, visit_id):
        comment = JSONParser().parse(request)
        comment['visit'] = visit_id
        now = datetime.now()
        comment['creation_date'] = now.strftime("%Y-%m-%d %H:%M:%S")
        comment_serializer = CommentSerializer(data = comment)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0
        try:
            doctor = Doctors.objects.get(user_id=self.request.user.id)
            doctor_serializer = DoctorSerializer(doctor)
            doctor_id=doctor_serializer.data["doctor_id"]
        except Doctors.DoesNotExist:
            doctor_id=0
        try:
            visit_doctor = Visits.objects.filter(doctor_id=doctor_id, visit_id=visit_id).get()
            visit_doctor_serializer = VisitSerializer(visit_doctor)
            visit_doctor_id=visit_doctor_serializer.data["visit_id"]
        except Visits.DoesNotExist:
            visit_doctor_id=0
        try:
            visit_patient = Visits.objects.filter(patient_id=patient_id, visit_id=visit_id).get()
            visit_patient_serializer = VisitSerializer(visit_patient)
            visit_patient_id=visit_patient_serializer.data["visit_id"]
        except Visits.DoesNotExist:
            visit_patient_id=0
        if comment_serializer.is_valid():
            if(visit_patient_id==visit_id or visit_doctor_id==visit_id or user_serializer.data["is_superuser"]):
                comment_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            else:
                return HttpResponse('Neturite administratoriaus teisių arba nesate šio vizito savininkas!', status=204, content_type='application/javascript')
        return JsonResponse(comment_serializer.errors, safe=False, status=400)

class CommentGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, visit_id, comment_id):
        try:
            comment = Comments.objects.filter(visit_id=visit_id, comment_id=comment_id).get()
        except Comments.DoesNotExist:
            return HttpResponse('Vizito komentaras nerastas!', status=404, content_type='application/javascript')
        comment_serializer = CommentSerializer(comment, many=False)
        return JsonResponse(comment_serializer.data, safe=False)
    def patch(self, request, visit_id, comment_id):
        try:
            comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id).get()
        except Comments.DoesNotExist:
            return HttpResponse('Vizito komentaras nerastas!', status=404, content_type='application/javascript')
        comment_data = JSONParser().parse(request)
        comment_serializer = CommentSerializer(comment, data = comment_data, partial=True)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0
        try:
            doctor = Doctors.objects.get(user_id=self.request.user.id)
            doctor_serializer = DoctorSerializer(doctor)
            doctor_id=doctor_serializer.data["doctor_id"]
        except Doctors.DoesNotExist:
            doctor_id=0
        try:
            visit_doctor = Visits.objects.filter(doctor_id=doctor_id, visit_id=visit_id).get()
            visit_doctor_serializer = VisitSerializer(visit_doctor)
            visit_doctor_id=visit_doctor_serializer.data["visit_id"]
        except Visits.DoesNotExist:
            visit_doctor_id=0
        try:
            visit_patient = Visits.objects.filter(patient_id=patient_id, visit_id=visit_id).get()
            visit_patient_serializer = VisitSerializer(visit_patient)
            visit_patient_id=visit_patient_serializer.data["visit_id"]
        except Visits.DoesNotExist:
            visit_patient_id=0
        if comment_serializer.is_valid():
            if(visit_patient_id==visit_id or visit_doctor_id==visit_id or user_serializer.data["is_superuser"]):
                comment_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            else:
                return HttpResponse('Neturite administratoriaus teisių arba nesate šio komentaro savininkas!', status=204, content_type='application/javascript')
        return JsonResponse(comment_serializer.errors, safe=False, status=400)
    def delete(self, request, visit_id, comment_id):
        try:
            comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id).get()
        except Comments.DoesNotExist:
            return HttpResponse('Vizito komentaras nerastas!', status=404, content_type='application/javascript')
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            patient = Patients.objects.get(user_id=self.request.user.id)
            patient_serializer = PatientSerializer(patient)
            patient_id=patient_serializer.data["patient_id"]
        except Patients.DoesNotExist:
            patient_id=0
        try:
            doctor = Doctors.objects.get(user_id=self.request.user.id)
            doctor_serializer = DoctorSerializer(doctor)
            doctor_id=doctor_serializer.data["doctor_id"]
        except Doctors.DoesNotExist:
            doctor_id=0
        try:
            visit_doctor = Visits.objects.filter(doctor_id=doctor_id, visit_id=visit_id).get()
            visit_doctor_serializer = VisitSerializer(visit_doctor)
            visit_doctor_id=visit_doctor_serializer.data["visit_id"]
        except Visits.DoesNotExist:
            visit_doctor_id=0
        try:
            visit_patient = Visits.objects.filter(patient_id=patient_id, visit_id=visit_id).get()
            visit_patient_serializer = VisitSerializer(visit_patient)
            visit_patient_id=visit_patient_serializer.data["visit_id"]
        except Visits.DoesNotExist:
            visit_patient_id=0
        if(visit_patient_id==visit_id or visit_doctor_id==visit_id or user_serializer.data["is_superuser"]):
            comment.delete()
            return JsonResponse("Sėkmingai ištrinta!", safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių arba nesate šio komentaro savininkas!', status=204, content_type='application/javascript')

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
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')
        

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
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')
    
class UserGet(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request, user_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            try:
                user = NewUser.objects.get(id=user_id)
            except NewUser.DoesNotExist:
                return HttpResponse('Vartotojas nerastas!', status=404, content_type='application/javascript')
            user_serializer = CustomUserSerializer(user, many=False)
            return JsonResponse(user_serializer.data, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')
        

    def patch(self, request, user_id):
        try:
            user = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return HttpResponse('Vartotojas nerastas!', status=404, content_type='application/javascript')
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
            return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')

    def delete(self, request, user_id):
        try:
            user_data = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return HttpResponse('Vartotojas nerastas!', status=404, content_type='application/javascript')

        if self.request.user.id != user_id:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"]):
                user_data.delete()
                return JsonResponse("Sėkmingai ištrinta!", safe=False)
            else:
                return HttpResponse('Neturite administratoriaus teisių!', status=204, content_type='application/javascript')
        else:
            return HttpResponse('Savęs ištrinti negalima!', status=204, content_type='application/javascript')