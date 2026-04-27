import json
import boto3
import uuid
from datetime import datetime

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ContactMessages')


def lambda_handler(event, context):

    # ✅ Handle CORS preflight request
    if event.get("httpMethod") == "OPTIONS":
        return response(200, {})

    try:
        body = json.loads(event.get('body', '{}'))

        # ✅ Required fields validation
        required_fields = ["firstName", "email", "message"]
        for field in required_fields:
            if not body.get(field):
                return response(400, {"error": f"{field} is required"})

        # ✅ Generate Ticket ID
        ticket_id = "TK-" + str(uuid.uuid4())[:8].upper()

        # ✅ Prepare item with safe defaults
        item = {
            "ticketId": ticket_id,
            "firstName": body.get("firstName", ""),
            "lastName": body.get("lastName", ""),
            "email": body.get("email", ""),
            "phone": body.get("phone", ""),
            "company": body.get("company", ""),
            "role": body.get("role", ""),
            "inquiryType": body.get("inquiryType", ""),
            "priority": body.get("priority", "Medium"),
            "subject": body.get("subject", ""),
            "message": body.get("message", ""),
            "contactMethod": body.get("contactMethod", "Email"),
            "source": body.get("source", "Website"),
            "rating": body.get("rating", ""),
            "timestamp": datetime.utcnow().isoformat()
        }

        # ✅ Store in DynamoDB
        table.put_item(Item=item)

        # ✅ Success response
        return response(200, {
            "message": "Form submitted successfully",
            "ticketId": ticket_id
        })

    except Exception as e:
        return response(500, {
            "error": str(e)
        })


# ✅ Common response function
def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps(body)
    }
