import requests

from accounts.api.serializers import AccountSerializer
from rest_framework_simplejwt.tokens import RefreshToken


def request_to_callback_url(authenticated_user, account, callback_url, identifier):
        # Retrieve Access token
        token = RefreshToken.for_user(authenticated_user)
        # Add Service Identifier to token
        token['aud'] = identifier
        # Add Admin to token
        token['admin'] = authenticated_user.is_superuser

        headers = {
            'Authorization': f"Bearer {token.access_token}"
        }

        # Account Data to be registered in other service
        account_data = AccountSerializer(account).data

        account_data['choose_role'] = account_data['role'].lower()
        response = requests.post(callback_url, data=account_data, headers=headers)
        
        return response
