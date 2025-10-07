# WhatsApp Flow Builder

🎨 **Complete WhatsApp Business automation platform** with visual flow builder, webhook integration, and automated message triggers.

## ✨ Features

### 🎯 **Visual Flow Builder**

- **Drag & Drop Interface** - Intuitive component arrangement with smooth animations
- **Mobile-First Design** - Fully responsive, works on phones, tablets, and desktops
- **Real-time Preview** - See your flow as you build it with WhatsApp-style preview
- **Inline Editing** - Click any component to edit properties in a modal
- **JSON Export** - Download WhatsApp Flow API v7.2 compatible JSON

### 🚀 **Webhook Automation System**

- **Automated Triggers** - Set keywords that automatically send flows to users
- **Backend Integration** - Complete Node.js server with WhatsApp Business API
- **Real-time Testing** - Test your webhooks without using real WhatsApp
- **Flow Management** - Create, publish, and manage flows directly from the interface
- **QR Code Generation** - Generate QR codes that trigger specific flows

### 🔧 **Advanced Features**

- **Flow Deployment** - Deploy flows directly to WhatsApp Business API
- **Trigger Management** - Add/remove keyword triggers with custom messages
- **Backend Health Monitoring** - Real-time server status and connection monitoring
- **Debug Tools** - Comprehensive testing and debugging interface
- **Production Ready** - Complete setup instructions for deployment

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your WhatsApp Business API credentials

# Start dev server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Configure backend environment
cp .env.example .env
# Edit backend/.env with your WhatsApp credentials

# Start backend server
npm start
```

### 🔧 Environment Configuration

Create `.env` files with your WhatsApp Business API credentials:

**Frontend (.env):**

```env
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
VITE_BACKEND_URL=http://localhost:3001
```

**Backend (backend/.env):**

```env
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_APP_SECRET=your_app_secret
FRONTEND_URL=http://localhost:5174
PORT=3001
```

## 🛠️ Tech Stack

### Frontend

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **dnd-kit** - Drag and drop functionality
- **Zustand** - State management
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** + **Express** - Server framework
- **WhatsApp Business API** - Official Meta API integration
- **CORS** + **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **Webhook Processing** - Real-time message handling

## 📦 Available Components

### Flow Building Components

- **Text Heading** - Display text subheadings and labels
- **Radio Buttons** - Single choice selection with multiple options
- **Text Area** - Multi-line text input fields
- **Dropdown** - Select from a dropdown list
- **Footer Button** - Navigation or completion actions

### Automation Features

- **Webhook Triggers** - Keyword-based flow activation
- **QR Code Generator** - Generate scannable codes for flows
- **Flow Testing** - Simulate webhook messages
- **Backend Integration** - Real-time server communication

## 🎯 How to Use

### Building Flows

1. **Create a Flow** - Start with the visual builder
2. **Add Components** - Drag components from the palette
3. **Configure Properties** - Click components to edit their settings
4. **Arrange Layout** - Drag to reorder components
5. **Preview & Test** - Use the WhatsApp-style preview
6. **Deploy Flow** - Publish directly to WhatsApp Business API

### Setting Up Webhooks

1. **Open Webhook Setup** - Click the "Webhooks" button in toolbar
2. **Configure Backend** - Ensure backend server is running
3. **Add Triggers** - Create keyword-based triggers (e.g., "hello" → flow)
4. **Test Integration** - Use the test webhook feature
5. **Deploy to Production** - Follow setup instructions for deployment

### Webhook Automation Flow

```
User sends "hello" via WhatsApp
        ↓
WhatsApp sends webhook to your server
        ↓
Backend matches "hello" to configured trigger
        ↓
System sends your flow to the user
        ↓
User completes the interactive form
```

## 📁 Project Structure

```
whatsapp-flow-builder/
├── src/                        # Frontend React application
│   ├── components/
│   │   ├── Canvas.tsx          # Main drag & drop canvas
│   │   ├── Palette.tsx         # Component palette
│   │   ├── WebhookSetup.tsx    # Webhook configuration UI
│   │   ├── WhatsAppPreview.tsx # Mobile preview panel
│   │   ├── QRCodeGenerator.tsx # QR code generation
│   │   ├── QRFlowInitiator.tsx # QR flow automation
│   │   ├── JsonPreviewPanel.tsx# JSON preview sidebar
│   │   ├── PropertyEditor.tsx  # Inline property editor
│   │   ├── PropertyEditorModal.tsx # Modal property editor
│   │   ├── ScreenSettings.tsx  # Screen configuration
│   │   ├── SortableItem.tsx    # Draggable wrapper components
│   │   ├── ConfirmDialog.tsx   # Delete confirmation dialogs
│   │   ├── Toast.tsx           # Notification components
│   │   ├── ToastContainer.tsx  # Toast management
│   │   ├── CreateFlowButton.tsx# Flow creation interface
│   │   └── SimpleFlowCreator.tsx# Simplified flow creation
│   ├── screens/
│   │   └── ScreenDesigner.tsx  # Main application layout
│   ├── pages/                  # Additional page components
│   ├── state/
│   │   └── store.ts            # Zustand state management
│   ├── utils/
│   │   ├── jsonBuilder.ts      # WhatsApp Flow JSON generator
│   │   ├── whatsappService.ts  # WhatsApp API integration
│   │   ├── whatsappSender.ts   # Flow sending utilities
│   │   ├── backendApiService.ts# Backend API communication
│   │   └── fileWriter.ts       # File download utilities
│   ├── types.ts                # TypeScript type definitions
│   ├── styles.css              # Global styles and Tailwind
│   ├── declarations.d.ts       # Type declarations
│   ├── env.d.ts                # Environment type definitions
│   └── index.tsx               # React app entry point
├── backend/                    # Node.js webhook server
│   ├── routes/
│   │   ├── webhook.js          # WhatsApp webhook endpoints
│   │   ├── triggers.js         # Trigger management API
│   │   └── whatsapp.js         # WhatsApp Business API routes
│   ├── services/
│   │   ├── webhookService.js   # Webhook processing logic
│   │   ├── triggerService.js   # Trigger management service
│   │   └── whatsappService.js  # WhatsApp Business API client
│   ├── server.js               # Express server setup
│   ├── package.json            # Backend dependencies
│   └── .env                    # Backend environment variables
├── public/
│   └── sample-flow.json        # Example flow output
├── dist/                       # Built frontend files (generated)
├── node_modules/               # Frontend dependencies (generated)
├── .env                        # Frontend environment variables
├── package.json                # Frontend dependencies and scripts
├── package-lock.json           # Dependency lock file
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # Node TypeScript config
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── index.html                  # Main HTML template
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## 🌐 API Endpoints

### Backend API Routes

- `GET /health` - Server health check
- `GET /webhook` - WhatsApp webhook verification
- `POST /webhook` - Receive WhatsApp messages
- `GET /api/triggers` - List all triggers
- `POST /api/triggers` - Create new trigger
- `DELETE /api/triggers/:id` - Delete trigger
- `POST /api/triggers/test` - Test trigger functionality

## 🚀 Deployment

### Backend Deployment (Heroku Example)

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set WHATSAPP_ACCESS_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_phone_id

# Deploy
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### WhatsApp Business API Setup

1. **Create Meta Business Account** - Register at business.facebook.com
2. **Set up WhatsApp Business** - Add WhatsApp product to your app
3. **Get Access Token** - Generate permanent access token
4. **Configure Webhook** - Point to your deployed backend URL
5. **Subscribe to Events** - Enable 'messages' webhook field

## 🔧 Configuration

### Webhook URL Configuration

Set your webhook URL in WhatsApp Business Manager:

```
https://your-backend-domain.com/webhook
```

### Required WhatsApp Permissions

- `whatsapp_business_messaging`
- `whatsapp_business_management`

## 📄 Sample Outputs

### Generated Flow JSON

The builder generates JSON compatible with WhatsApp Flow API v7.2:

```json
{
  "version": "7.2",
  "screens": [
    {
      "id": "WELCOME",
      "title": "Registration Form",
      "layout": {
        "type": "SingleColumnLayout",
        "children": [...]
      }
    }
  ]
}
```

### Webhook Trigger Example

```javascript
// User sends: "hello"
// System responds with flow message:
{
  "messaging_product": "whatsapp",
  "to": "918281348343",
  "type": "interactive",
  "interactive": {
    "type": "flow",
    "header": { "type": "text", "text": "Welcome!" },
    "body": { "text": "Please complete this form:" },
    "action": {
      "name": "flow",
      "parameters": {
        "flow_message_version": "3",
        "flow_token": "unique-token",
        "flow_id": "your-flow-id",
        "flow_cta": "Start Form",
        "flow_action": "navigate"
      }
    }
  }
}
```

## 🎨 Customization

### Styling

- Built with **Tailwind CSS** and custom WhatsApp theme
- Modify `tailwind.config.js` for color customization
- Custom animations with **Framer Motion**

### Adding New Components

1. Create component in `src/components/`
2. Add to component palette in `Palette.tsx`
3. Update JSON builder in `utils/jsonBuilder.ts`

## 🐛 Troubleshooting

### Common Issues

**Backend not connecting:**

- Check if server is running on port 3001
- Verify CORS configuration for your frontend URL
- Ensure environment variables are properly set

**Webhook not receiving messages:**

- Verify webhook URL is publicly accessible
- Check WhatsApp Business Manager webhook configuration
- Ensure webhook verification token matches

**Flow not sending:**

- Verify WhatsApp access token has proper permissions
- Check phone number ID is correct
- Ensure flow is published (not in DRAFT status)

## 📝 License

MIT License - Feel free to use this project for commercial and personal purposes.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## � Support

For issues and questions:

- Open GitHub Issues for bug reports
- Check documentation in `/docs` folder
- Review WhatsApp Business API documentation
