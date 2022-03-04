from API import views
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings

from API.views import BlacklistTokenUpdateView, ChangePasswordView, UserView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path('doctor', views.DoctorGetList.as_view(), name='doctor_list'),
    path('doctor/<int:doctor_id>', views.DoctorGet.as_view(), name='doctor_detail'),

    path('doctor/<int:doctor_id>/work_hours', views.DoctorWorkHoursList.as_view(), name='work_hours_list'),
    path('doctor/<int:doctor_id>/work_hours/<int:week_day>', views.DoctorWorkHours.as_view(), name='work_hours_detail'),

    path('patient', views.PatientGetList.as_view(), name='patient_list'),
    path('patient/<int:patient_id>', views.PatientGet.as_view(), name='patient_detail'),

    path('patient/<int:patient_id>/allergy', views.PatientAllergyGetList.as_view(), name='patient_allergy_list'),
    path('patient/<int:patient_id>/allergy/<int:allergy_id>', views.PatientAllergyGet.as_view(), name='patient_allergy_detail'),

    path('visit', views.VisitGetList.as_view(), name='visit_list'),
    path('visit/<int:visit_id>', views.VisitGet.as_view(), name='visit_detail'),

    path('diagnosis', views.DiagnosisGetList.as_view(), name='diagnosis_list'),
    path('diagnosis/<int:diagnosis_id>', views.DiagnosisGet.as_view(), name='diagnosis_detail'),

    path('prescription', views.PrescriptionGetList.as_view(), name='prescription_list'),
    path('prescription/<int:prescription_id>', views.PrescriptionGet.as_view(), name='prescription_detail'),

    path('laboratory_test', views.LaboratoryTestGetList.as_view(), name='laboratory_test_list'),
    path('laboratory_test/<int:test_id>', views.LaboratoryTestGet.as_view(), name='laboratory_test_detail'),
    
    path('visit/<int:visit_id>/comment', views.CommentGetList.as_view(), name='comment_list'),
    path('visit/<int:visit_id>/comment/<int:comment_id>', views.CommentGet.as_view(), name='comment_detail'),

    path('visit_status', views.VisitStatusGetList.as_view(), name='status_list'),
    path('visit_status/<int:status_id>', views.VisitStatusGet.as_view(), name='status_detail'),

    path('user', views.UserGetList.as_view(), name='user_list'),
    path('user/<int:user_id>', views.UserGet.as_view(), name='user_detail'),

    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout', BlacklistTokenUpdateView.as_view(), name='logout'),
    path('change_password', ChangePasswordView.as_view(), name='change_password'),
    path('info', UserView.as_view(), name='info')
]