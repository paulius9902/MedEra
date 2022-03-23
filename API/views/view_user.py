from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from API.models import NewUser
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer, CustomUserSerializerDepth
from django.http import HttpResponse

class UserGetList(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(UserGetList, self).get_permissions()
    def get(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            users = NewUser.objects.all()
            users_serializer = CustomUserSerializerDepth(users, many=True)
            return JsonResponse(users_serializer.data, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)

    def post(self, request):
        user_data = JSONParser().parse(request)
        user_serializer = CustomUserSerializer(data = user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            user_serializer.data
            return JsonResponse("Sėkmingai pridėta!",safe=False)
        return JsonResponse(user_serializer.errors, status=400)
    
class UserGet(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request, user_id):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            try:
                user = NewUser.objects.get(id=user_id)
            except NewUser.DoesNotExist:
                return HttpResponse('Vartotojas nerastas!', status=404)
            user_serializer = CustomUserSerializerDepth(user, many=False)
            return JsonResponse(user_serializer.data, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)
        

    def patch(self, request, user_id):
        try:
            user = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return HttpResponse('Vartotojas nerastas!', status=404)
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
            return HttpResponse('Neturite administratoriaus teisių!', status=204)

    def delete(self, request, user_id):
        try:
            user_data = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return HttpResponse('Vartotojas nerastas!', status=404)

        if self.request.user.id != user_id:
            user = NewUser.objects.get(id=self.request.user.id)
            user_serializer = CustomUserSerializer(user)
            if(user_serializer.data["is_superuser"]):
                user_data.delete()
                return JsonResponse("Sėkmingai ištrinta!", safe=False)
            else:
                return HttpResponse('Neturite administratoriaus teisių!', status=204)
        else:
            return HttpResponse('Savęs ištrinti negalima!', status=204)