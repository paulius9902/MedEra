from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from API.models import Allergies
from API.serializers import AllergySerializer
from django.http.response import JsonResponse
from django.http import HttpResponse

class AllergyGetList(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        allergies = Allergies.objects.all()
        allergies_serializer = AllergySerializer(allergies, many=True)
        return JsonResponse(allergies_serializer.data, safe=False)
    
class AllergyGet(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, allergy_id):
        try:
            allergy = Allergies.objects.get(allergy_id=allergy_id)
        except Allergies.DoesNotExist:
            return HttpResponse('Alergija nerasta!', status=404)
        allergy_serializer = AllergySerializer(allergy, many=False)
        return JsonResponse(allergy_serializer.data, safe=False)