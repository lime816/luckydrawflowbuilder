# Message & Trigger Library Feature

## Overview

The Message & Trigger Library is a comprehensive feature that allows users to create, save, and manage reusable WhatsApp messages (including Interactive Messages) and associate editable triggers with them. This system provides a centralized way to manage messaging templates and their activation conditions.

## Features

### 1. Message Management
- **Create** reusable WhatsApp message templates
- **Edit** existing messages with real-time preview
- **Delete** messages with confirmation
- **Duplicate** messages for quick template creation
- **Search & Filter** messages by type, status, and keywords

### 2. Message Types Supported

#### Standard Text Messages
- Simple text-based messages
- Support for WhatsApp formatting (bold, italic, etc.)

#### Interactive Button Messages (Max 3 buttons)
- Header text (optional)
- Message body
- Footer text (optional)
- Up to 3 reply buttons with custom titles and IDs

#### Interactive List Messages (Max 10 rows)
- Header text (optional)
- Message body
- Footer text (optional)
- Button text for opening the list
- Organized sections with multiple rows
- Each row has title, ID, and optional description

#### Flow Starter Messages
- Integration with existing WhatsApp Flows
- Custom activation message
- Flow ID reference for launching specific flows

### 3. Trigger Configuration

#### Keyword Match Triggers
- Multiple keywords (comma-separated)
- Case-insensitive matching
- Regular expression support

#### API Call Triggers
- Unique endpoint identifiers
- External system integration
- Backend API activation

#### Flow Response Triggers
- Button/Row ID matching
- Interactive message response handling
- Chained conversation flows

### 4. Data Persistence
- **Firebase/Firestore integration** (configurable)
- **localStorage fallback** for development
- **Export/Import functionality** for data migration
- **Real-time data synchronization**

## File Structure

```
src/
├── types.ts                           # Extended with Message Library types
├── state/
│   └── messageLibraryStore.ts        # Zustand store for state management
├── utils/
│   └── firebaseService.ts            # Firebase/Firestore service
├── components/
│   ├── MessageLibrary.tsx            # Main library component
│   └── MessageLibrary/
│       ├── MessageList.tsx           # Message listing with search/filter
│       ├── MessageEditor.tsx         # Message creation/editing interface
│       ├── TriggerEditor.tsx         # Trigger configuration interface
│       └── MessageEditor/
│           ├── StandardTextEditor.tsx      # Standard text message editor
│           ├── InteractiveButtonEditor.tsx # Interactive button editor
│           ├── InteractiveListEditor.tsx   # Interactive list editor
│           └── FlowStarterEditor.tsx       # Flow starter editor
```

## Usage

### Accessing the Message Library
1. Click the **"Message Library"** button in the main navigation
2. The library opens as a full-screen overlay with two main sections:
   - **Message List** (left panel)
   - **Message Editor** (right panel, when editing)

### Creating a New Message
1. Click **"+ New Message"** button
2. Enter a descriptive name for the message
3. Select the message type from the dropdown
4. Configure the message content based on the selected type
5. Set up triggers in the **"Trigger Configuration"** tab
6. Click **"Save"** to store the message

### Managing Existing Messages
- **Edit**: Click the edit icon on any message in the list
- **Duplicate**: Click the copy icon to create a duplicate
- **Delete**: Click the delete icon (with confirmation)
- **Search**: Use the search bar to find specific messages
- **Filter**: Use type and status filters to narrow results

### Configuring Triggers
1. Open a message for editing
2. Switch to the **"Trigger Configuration"** tab
3. Click **"Add Trigger"** to create a new trigger
4. Select trigger type and configure values:
   - **Keyword Match**: Enter comma-separated keywords
   - **API Call**: Set unique endpoint identifier
   - **Flow Response**: Specify button/row ID to match
5. Set the next action (Send Message or Start Flow)
6. Specify the target ID (message or flow)

## Data Models

### MessageLibraryEntry
```typescript
{
  messageId: string           // Unique identifier
  name: string               // User-friendly name
  type: MessageType          // standard_text | interactive_button | interactive_list | flow_starter
  contentPayload: object     // Type-specific message content
  status: MessageStatus      // draft | published
  createdAt: Date           // Creation timestamp
  updatedAt: Date           // Last modification timestamp
}
```

### TriggerConfiguration
```typescript
{
  triggerId: string          // Unique identifier
  triggerType: TriggerType   // keyword_match | api_call | flow_response
  triggerValue: string|array // Trigger condition values
  nextAction: NextAction     // send_message | start_flow
  targetId: string          // Reference to message or flow
  messageId: string         // Associated message ID
  createdAt: Date          // Creation timestamp
  updatedAt: Date          // Last modification timestamp
}
```

## Firebase Setup (Optional)

The system uses localStorage by default for development. To enable Firebase/Firestore:

### 1. Install Firebase SDK
```bash
npm install firebase
```

### 2. Environment Variables
Add to your `.env` file:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    match /triggers/{triggerId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Enable Firebase in Code
Uncomment the Firebase initialization code in `src/utils/firebaseService.ts`

## Integration with Existing System

The Message Library integrates seamlessly with the existing WhatsApp Flow Builder:

1. **Navigation**: Added as a new tab in the main application header
2. **State Management**: Uses Zustand for consistent state management patterns
3. **UI Components**: Follows existing design system and component patterns
4. **Data Flow**: Compatible with existing trigger detection services
5. **Export Format**: Messages export in WhatsApp Business API-compliant format

## API Integration

### Trigger Detection Service
The system is designed to work with an external trigger detection service that:
- Monitors incoming WhatsApp messages
- Matches against configured triggers
- Calls appropriate message sending or flow starting actions

### Expected Integration Points
1. **Keyword Matching**: Service checks incoming messages against keyword triggers
2. **API Endpoints**: External systems can trigger messages via API calls using trigger IDs
3. **Flow Responses**: Interactive message responses trigger follow-up actions

## Development Notes

### TypeScript Support
All components are fully typed with comprehensive TypeScript interfaces.

### Error Handling
- Graceful fallbacks for network failures
- User-friendly error messages
- Console logging for debugging

### Performance Considerations
- Lazy loading of message content
- Efficient search and filtering
- Minimal re-renders with optimized state updates

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

## Future Enhancements

1. **Message Templates**: Pre-built templates for common use cases
2. **Analytics**: Usage statistics and performance metrics
3. **Scheduling**: Time-based message triggers
4. **Personalization**: Dynamic content insertion
5. **Multi-language**: Internationalization support
6. **Bulk Operations**: Mass import/export and batch editing
7. **Version Control**: Message versioning and rollback capabilities

## Testing

### Manual Testing Checklist
- [ ] Create messages of each type
- [ ] Edit existing messages
- [ ] Delete messages with confirmation
- [ ] Duplicate messages
- [ ] Search and filter functionality
- [ ] Trigger configuration for each type
- [ ] Data persistence (localStorage/Firebase)
- [ ] Export/Import functionality
- [ ] Real-time preview updates
- [ ] Responsive design on different screen sizes

### Integration Testing
- [ ] Message Library opens from main navigation
- [ ] Data loads correctly on component mount
- [ ] State persists across sessions
- [ ] Firebase integration (if enabled)
- [ ] No conflicts with existing Flow Builder functionality

## Support

For technical support or feature requests related to the Message & Trigger Library:

1. Check the console for error messages
2. Verify Firebase configuration (if using)
3. Test with localStorage fallback
4. Review component props and state management
5. Check network connectivity for Firebase operations

## Conclusion

The Message & Trigger Library provides a powerful, user-friendly interface for managing WhatsApp messaging templates and their activation conditions. It's designed to scale with your messaging needs while maintaining simplicity and reliability.
