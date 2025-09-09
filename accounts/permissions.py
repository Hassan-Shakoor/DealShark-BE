from rest_framework.permissions import BasePermission


class IsBusinessUser(BasePermission):
    """
    Allow access only for business users with a linked business profile
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.user_type == 'business'
            and hasattr(request.user, 'business_profile')
        )
