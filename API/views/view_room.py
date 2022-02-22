from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from API.models import Rooms, NewUser
from API.serializers import RoomSerializer
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from API.serializers import CustomUserSerializer
from django.http import HttpResponse

class RoomGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        rooms = Rooms.objects.all()
        rooms_serializer = RoomSerializer(rooms, many=True)
        return JsonResponse(rooms_serializer.data, safe=False)

    def post(self, request):
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            room_data = JSONParser().parse(request)
            rooms_serializer = RoomSerializer(data = room_data)
            if rooms_serializer.is_valid():
                rooms_serializer.save()
                rooms_serializer.data
                return JsonResponse("Sėkmingai pridėta!",safe=False)
            return JsonResponse(rooms_serializer.errors, status=400)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)
    
class RoomGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, room_id):
        try:
            room = Rooms.objects.get(room_id=room_id)
        except Rooms.DoesNotExist:
            return HttpResponse('Kabinetas nerastas!', status=404)
        rooms_serializer = RoomSerializer(room, many=False)
        return JsonResponse(rooms_serializer.data, safe=False)

    def patch(self, request, room_id):
        try:
            room = Rooms.objects.get(room_id=room_id)
        except Rooms.DoesNotExist:
            return HttpResponse('Kabinetas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            room_data = JSONParser().parse(request)
            rooms_serializer = RoomSerializer(room, data = room_data, partial=True)
            if rooms_serializer.is_valid():
                rooms_serializer.save()
                return JsonResponse("Sėkmingai atnaujinta!", status=200, safe=False)
            return JsonResponse(rooms_serializer.errors, status=400, safe=False)
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)

    def delete(self, request, room_id):
        try:
            room = Rooms.objects.get(room_id=room_id)
        except Rooms.DoesNotExist:
            return HttpResponse('Kabinetas nerastas!', status=404)
        user = NewUser.objects.get(id=self.request.user.id)
        user_serializer = CustomUserSerializer(user)
        if(user_serializer.data["is_superuser"]):
            room.delete()
            return HttpResponse('Sėkmingai ištrinta!')
        else:
            return HttpResponse('Neturite administratoriaus teisių!', status=204)