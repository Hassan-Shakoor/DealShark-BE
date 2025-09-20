from django.db import transaction
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


from config.firebase import upload_file_to_firebase


class FirebaseUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        with transaction.atomic():
            if "file" not in request.FILES:
                return Response({"error": "No file uploaded."}, status=400)

            file = request.FILES["file"]
            path = f"uploads/{file.name}"

            try:
                url = upload_file_to_firebase(file, path)
                return Response({"url": url}, status=201)
            except Exception as e:
                return Response({"error": str(e)}, status=500)