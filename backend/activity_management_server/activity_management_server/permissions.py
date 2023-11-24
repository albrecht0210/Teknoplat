from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsWildcatAdmin(BasePermission):
    def has_permission(self, request, view):
        try:
            assert request.user and request.user.is_authenticated

            if request.auth.payload.get('admin'):
                return True
        except AssertionError:
            return False

class IsTeacherUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        else:
            return request.user.get_role() == 'Teacher' or request.user.get_role() == 'Admin'

class IsWildcatAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        else:
            try:
                assert request.user and request.user.is_authenticated
                if request.auth.payload.get('admin'):
                    return True
            except AssertionError:
                return False