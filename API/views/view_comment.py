from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from API.models import Visits, NewUser, Patients, Comments, Doctors
from API.serializers import VisitSerializer, PatientSerializer, CommentSerializer, DoctorSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse
from django.db.models import Q
from datetime import datetime

class CommentGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, visit_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
            comments = Comments.objects.filter(visit=visit_id)
        else:
            comments = Comments.objects.filter(Q(user=self.request.user.id) & Q(visit=visit_id))
        comments_serializer=CommentSerializer(comments, many=True)
        return JsonResponse(comments_serializer.data, safe=False)
    def post(self, request, visit_id):
        comment = JSONParser().parse(request)
        comment['visit'] = visit_id
        comment['user'] = self.request.user.id
        comment_serializer = CommentSerializer(data = comment)
        
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        
        try:
            visit = Visits.objects.get(visit_id=visit_id)
            visit_serializer = VisitSerializer(visit)
        except:
            return HttpResponse('Vizitas nerastas!', status=404)
        
        if comment_serializer.is_valid():
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"] or user_serializer.data["patient"]==visit_serializer.data["patient"]) :
                comment_serializer.save()
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            else:
                return HttpResponse('Neturite administratoriaus teisių arba nesate šio vizito savininkas!', status=204)
        return JsonResponse(comment_serializer.errors, safe=False, status=400)

class CommentGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, visit_id, comment_id):
        try:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id).get()
            else:
                comment = Comments.objects.filter(Q(user=self.request.user.id) & Q(visit=visit_id) & Q(comment_id=comment_id)).get()
        except Comments.DoesNotExist:
            return HttpResponse('Vizito komentaras nerastas!', status=404)
        comment_serializer = CommentSerializer(comment, many=False)
        return JsonResponse(comment_serializer.data, safe=False)
    def patch(self, request, visit_id, comment_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)

        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id).get()
            else:
                comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id, user=self.request.user.id).get()
        except Comments.DoesNotExist:
            return HttpResponse('Vizito komentaras nerastas arba neturite teisių jį koreguoti!', status=204)
        comment_data = JSONParser().parse(request)
        comment_serializer = CommentSerializer(comment, data = comment_data, partial=True)
        
        if comment_serializer.is_valid():
            comment_serializer.save()
            return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
        return JsonResponse(comment_serializer.errors, safe=False, status=400)

    def delete(self, request, visit_id, comment_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        try:
            if(user_serializer.data["is_superuser"] or user_serializer.data["is_doctor"]):
                comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id).get()
            else:
                comment = Comments.objects.filter(visit=visit_id, comment_id=comment_id, user=self.request.user.id).get()
        except Comments.DoesNotExist:
            return HttpResponse('Vizito komentaras nerastas arba neturite teisių jį ištrinti!', status=404)
        comment.delete()
        return JsonResponse("Sėkmingai ištrinta!", safe=False)