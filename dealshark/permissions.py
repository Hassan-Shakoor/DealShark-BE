from rest_framework.permissions import BasePermission


class IsOwnerOrReadOnly(BasePermission):
    """
    Allow owners to edit their own objects, others can only read
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'business') and hasattr(obj.business, 'user'):
            return obj.business.user == request.user
        elif hasattr(obj, 'referrer'):
            return obj.referrer == request.user

        return False
