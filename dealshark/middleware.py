import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger(__name__)

class APILoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            logger.info(f"API Request: {request.method} {request.path} from {request.META.get('REMOTE_ADDR')}")

    def process_response(self, request, response):
        if request.path.startswith('/api/'):
            logger.info(f"API Response: {response.status_code} for {request.method} {request.path}")
        return response


class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if request.path.startswith('/api/'):
            logger.error(f"API Exception: {str(exception)} for {request.method} {request.path}")
            return JsonResponse({
                'error': 'An internal server error occurred.',
                'message': 'Please try again later.'
            }, status=500)
        return None
