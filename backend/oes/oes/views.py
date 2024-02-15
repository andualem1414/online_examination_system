from django.http import JsonResponse


def error_handler(request):
    response_data = {"error": "An error occurred somewhere"}
    return JsonResponse(response_data, status=500)
