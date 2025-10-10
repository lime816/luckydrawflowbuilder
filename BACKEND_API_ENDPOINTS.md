# Backend API Endpoints for Message & Trigger Library

Your backend at `https://whatsappbackend-production-8946.up.railway.app` needs to implement these endpoints:

## Base URL
```
https://whatsappbackend-production-8946.up.railway.app/api/message-library
```

## Message Endpoints

### 1. Get All Messages
```http
GET /messages
```
**Response:**
```json
[
  {
    "messageId": "string",
    "name": "string",
    "type": "standard_text|interactive_button|interactive_list|flow_starter",
    "contentPayload": {},
    "status": "draft|published",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Create/Update Message
```http
POST /messages
Content-Type: application/json

{
  "messageId": "string",
  "name": "string",
  "type": "standard_text|interactive_button|interactive_list|flow_starter",
  "contentPayload": {},
  "status": "draft|published",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Update Message
```http
PUT /messages/{messageId}
Content-Type: application/json

{
  "name": "string",
  "contentPayload": {},
  "status": "draft|published"
}
```

### 4. Delete Message
```http
DELETE /messages/{messageId}
```

### 5. Publish Message
```http
POST /messages/{messageId}/publish
```

### 6. Unpublish Message
```http
POST /messages/{messageId}/unpublish
```

### 7. Get Published Messages Only
```http
GET /messages/published
```

## Trigger Endpoints

### 1. Get All Triggers
```http
GET /triggers
```

### 2. Get Triggers by Message ID
```http
GET /triggers/message/{messageId}
```

### 3. Create/Update Trigger
```http
POST /triggers
Content-Type: application/json

{
  "triggerId": "string",
  "triggerType": "keyword_match|api_call|flow_response",
  "triggerValue": "string|array",
  "nextAction": "send_message|start_flow",
  "targetId": "string",
  "messageId": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Trigger
```http
PUT /triggers/{triggerId}
```

### 5. Delete Trigger
```http
DELETE /triggers/{triggerId}
```

### 6. Find Matching Triggers (for webhook processing)
```http
POST /triggers/match
Content-Type: application/json

{
  "messageText": "string",
  "phoneNumber": "string"
}
```

## Bulk Operations

### 1. Export All Data
```http
GET /export
```
**Response:**
```json
{
  "messages": [...],
  "triggers": [...]
}
```

### 2. Import Data
```http
POST /import
Content-Type: application/json

{
  "messages": [...],
  "triggers": [...]
}
```

## Content Payload Examples

### Standard Text Message
```json
{
  "body": "Your message content here..."
}
```

### Interactive Button Message
```json
{
  "header": "Header Text",
  "body": "Your message body here...",
  "footer": "Footer Text",
  "buttons": [
    {
      "id": "btn123",
      "title": "Button 1",
      "buttonId": "btn_1"
    }
  ]
}
```

### Interactive List Message
```json
{
  "header": "Header Text",
  "body": "Your message body here...",
  "footer": "Footer Text",
  "buttonText": "View Options",
  "sections": [
    {
      "title": "Section 1",
      "rows": [
        {
          "id": "row123",
          "title": "Option 1",
          "rowId": "opt_1",
          "description": "Description for option 1"
        }
      ]
    }
  ]
}
```

### Flow Starter Message
```json
{
  "flowId": "flow_123",
  "message": "Please complete this form to continue."
}
```

## Database Schema Suggestions

### Messages Table
```sql
CREATE TABLE messages (
  messageId VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('standard_text', 'interactive_button', 'interactive_list', 'flow_starter') NOT NULL,
  contentPayload JSON NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Triggers Table
```sql
CREATE TABLE triggers (
  triggerId VARCHAR(255) PRIMARY KEY,
  triggerType ENUM('keyword_match', 'api_call', 'flow_response') NOT NULL,
  triggerValue JSON NOT NULL,
  nextAction ENUM('send_message', 'start_flow') NOT NULL,
  targetId VARCHAR(255) NOT NULL,
  messageId VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES messages(messageId) ON DELETE CASCADE
);
```

## Integration with Webhook Processing

When your webhook receives a WhatsApp message, you should:

1. Call `POST /triggers/match` with the message text
2. For each matching trigger:
   - If `nextAction` is `send_message`: Get the message by `targetId` and send it
   - If `nextAction` is `start_flow`: Start the flow with `targetId`

## Error Responses

All endpoints should return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Example error response:
```json
{
  "error": "Message not found",
  "code": "MESSAGE_NOT_FOUND"
}
```
