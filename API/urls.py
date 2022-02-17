from API import views
from django.urls import path, include

from django.conf.urls.static import static
from django.conf import settings

urlpatterns=[
    path('doctor', views.DoctorGetList.as_view(), name='doctor_list'),
    path('doctor/<int:doctor_id>', views.DoctorGet.as_view(), name='doctor_detail'),
    path('doctor/<int:doctor_id>/work_hours', views.DoctorWorkHoursList.as_view(), name='work_hours_list'),
    path('doctor/<int:doctor_id>/work_hours/<int:week_day>', views.DoctorWorkHours.as_view(), name='work_hours_detail'),


    path('patient', views.PatientGetList.as_view(), name='patient_list'),
    path('patient/<int:patient_id>', views.PatientGet.as_view(), name='patient_detail'),
    path('visit', views.VisitGetList.as_view(), name='visit_list'),
    path('visit/<int:visit_id>', views.VisitGet.as_view(), name='visit_detail'),
    path('visit/<int:visit_id>/comment', views.CommentGetList.as_view(), name='comment_list'),
    path('visit/<int:visit_id>/comment/<int:comment_id>', views.CommentGet.as_view(), name='comment_detail'),

    path('user', views.UserGetList.as_view(), name='user_list'),
    path('user/<int:user_id>', views.UserGet.as_view(), name='user_detail'),
]