from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, AccountCourseAPIView

# Create a router for the CourseViewSet
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    # Include the router's URL patterns
    path('', include(router.urls)),
    path('courses/<int:pk>/add_course_member/', CourseViewSet.as_view({'post': 'add_course_member'}), name='add-course-member'),
    path('courses/<int:pk>/get_course_members/', CourseViewSet.as_view({'get': 'get_course_members'}), name='get-course-members'),
    
    path('account/profile/courses/', AccountCourseAPIView.as_view(), name='courses-by-account'),
]