from django.urls import re_path

from .consumers import MeetingConsumer, MeetingNotificationConsumer

websocket_urlpatterns = [
    re_path(r"ws/meetings/(?P<course_room>\w+)/$", MeetingConsumer.as_asgi()),
    re_path(r"ws/meetings/(?P<course_room>\w+)/notification/$", MeetingNotificationConsumer.as_asgi()),
]