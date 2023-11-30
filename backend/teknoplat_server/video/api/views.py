import datetime, requests, jwt
from rest_framework import permissions, status, views
from rest_framework.response import Response

VIDEOSDK_API_ENDPOINT = 'https://api.videosdk.live'

class CreateMeetingView(views.APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        res = requests.post(VIDEOSDK_API_ENDPOINT + '/api/meetings',
                            headers={'Authorization': data['token']})
        return Response(res.json(), status=res.status_code)

class ValidateMeetingView(views.APIView):
    def post(self, request, video_meeting_id, *args, **kwargs):
        data = request.data
        res = requests.post(VIDEOSDK_API_ENDPOINT + f'/api/meetings/{video_meeting_id}',
                            headers={'Authorization': data['token']})
        if res.status_code == 400:
            return Response({ 'error': 'Video ID is not valid.' }, status=res.status_code)
        return Response(res.json(), status=res.status_code)    

class VideoAuthenticateTokenView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    VIDEOSDK_API_KEY  = "fad76f00-2b26-41ae-ab29-698c9d6ca4a1"
    VIDEOSDK_SECRET_KEY = "16af5ce994c657c13e80ec4aba564949f11d1ea267b941973187ecc0766a0bb8"
    
    def post(self, request, *args, **kwargs):
        expiration_in_seconds = 600
        expiration = datetime.datetime.now() + datetime.timedelta(seconds=expiration_in_seconds)
        token = jwt.encode(payload={
            'exp': expiration,
            'apikey': self.VIDEOSDK_API_KEY,
            'permissions': ["allow_join", "allow_mod"],
        }, key=self.VIDEOSDK_SECRET_KEY, algorithm="HS256")

        return Response(token, status=status.HTTP_200_OK)