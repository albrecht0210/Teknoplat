"""
ASGI config for teknoplat_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from django.core.asgi import get_asgi_application

from meetings.api.routings import websocket_urlpatterns as meeting_websocket_urls
from comments.api.routings import websocket_urlpatterns as comment_websocket_urls
from chats.api.routings import websocket_urlpatterns as chat_websocket_urls

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'teknoplat_server.settings')

application = get_asgi_application()

django_asgi_app = get_asgi_application()

websocket_urlpatterns = [
] + meeting_websocket_urls + comment_websocket_urls + chat_websocket_urls

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        # can this have multiple router?
    )
})
