from API import views
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings

from API.views import BlacklistTokenUpdateView, ChangePasswordView, UserView
from API.views.view_visit import VisitCancelEmail, VisitConfirmEmail
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from API.views.view_auth import PasswordTokenViewAPI, RequestPasswordResetEmail, SetNewPasswordAPIView

urlpatterns=[
    path('allergy', views.AllergyGetList.as_view(), name='allergy_list'),

    path('doctor', views.DoctorGetList.as_view(), name='doctor_list'),
    path('doctor/<int:doctor_id>', views.DoctorGet.as_view(), name='doctor_detail'),

    path('patient', views.PatientGetList.as_view(), name='patient_list'),
    path('patient_reg', views.PatientGetListReg.as_view(), name='patient_reg'),
    path('patient/<int:patient_id>', views.PatientGet.as_view(), name='patient_detail'),

    path('patient/<int:patient_id>/allergy', views.PatientAllergyGetList.as_view(), name='patient_allergy_list'),
    path('patient/<int:patient_id>/allergy/<int:allergy_id>', views.PatientAllergyGet.as_view(), name='patient_allergy_detail'),
    path('patient/<int:patient_id>/visit', views.PatientVisitsGetList.as_view(), name='patient_visit_list'),
    path('patient/<int:patient_id>/diagnosis', views.PatientDiagnosisGetList.as_view(), name='patient_diagnosis_list'),
    path('patient/<int:patient_id>/lab_test', views.PatientLaboratoryTestGetList.as_view(), name='patient_lab_test_list'),
    path('patient/<int:patient_id>/prescription', views.PatientPrescriptionGetList.as_view(), name='patient_prescription_list'),

    path('visit', views.VisitGetList.as_view(), name='visit_list'),
    path('visit_dates', views.VisitDatesList.as_view(), name='visit_dates_list'),
    path('visit/<int:visit_id>', views.VisitGet.as_view(), name='visit_detail'),

    path('diagnosis', views.DiagnosisGetList.as_view(), name='diagnosis_list'),
    path('diagnosis/<int:diagnosis_id>', views.DiagnosisGet.as_view(), name='diagnosis_detail'),

    path('prescription', views.PrescriptionGetList.as_view(), name='prescription_list'),
    path('prescription/<int:prescription_id>', views.PrescriptionGet.as_view(), name='prescription_detail'),

    path('laboratory_test', views.LaboratoryTestGetList.as_view(), name='laboratory_test_list'),
    path('laboratory_test/<int:test_id>', views.LaboratoryTestGet.as_view(), name='laboratory_test_detail'),

    path('visit_status', views.VisitStatusGetList.as_view(), name='status_list'),
    path('visit_status/<int:status_id>', views.VisitStatusGet.as_view(), name='status_detail'),

    path('user', views.UserGetList.as_view(), name='user_list'),
    path('user_reg', views.UserGetListReg.as_view(), name='user_reg'),
    path('user/<int:user_id>', views.UserGet.as_view(), name='user_detail'),

    path('patient_count', views.PatientGetCount.as_view(), name='patient_count'),
    path('doctor_count', views.DoctorGetCount.as_view(), name='doctor_count'),
    path('visit_count', views.VisitGetCount.as_view(), name='visit_count'),
    path('user_count', views.UserGetCount.as_view(), name='user_count'),

    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout', BlacklistTokenUpdateView.as_view(), name='logout'),
    path('change_password', ChangePasswordView.as_view(), name='change_password'),
    path('info', UserView.as_view(), name='info'),

    path('reset_email_request', RequestPasswordResetEmail.as_view(), name="reset_email_request"),
    path('password_reset/<uidb64>/<token>', PasswordTokenViewAPI.as_view(), name="password_reset_confirm"),
    path('password_reset_complete', SetNewPasswordAPIView.as_view(), name="password_reset_complete"),

    path('visit_confirm_email/<int:visit_id>', VisitConfirmEmail.as_view(), name="visit_confirm_email"),
    path('visit_cancel_email/<int:visit_id>', VisitCancelEmail.as_view(), name="visit_cancel_email"),
]