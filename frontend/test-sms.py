import json
import requests
from datetime import datetime, timezone, timedelta

# Nairobi timezone (+03:00)
time = datetime.now(timezone(timedelta(hours=3)))
send_at = time.strftime("%Y-%m-%dT%H:%M:%S%z")
# Convert +0300 to +03:00 for RFC3339
send_at = send_at[:-2] + ":" + send_at[-2:]

api_key = "uk_WUglFij_zfl1jHPMoGIa1i5BF5HVQZ7YvWdJXvPfHC4cwRPcLcmiSBKgsdzZAFHq"
url = 'https://api.httpsms.com/v1/messages/send'

headers = {
    'x-api-key': api_key,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

payload = {
    "content": "This is a sample text message",
    "from": "+254703222614",
    "to": "+254718497275"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))

print(response.json())