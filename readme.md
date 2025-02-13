# Call Center Dashboard with Twilio Integration

A modern call center dashboard built with React and Twilio, featuring real-time call management, agent status tracking, and advanced call handling capabilities.

## Features

### Call Management
- 📞 Real-time call handling
- 🔄 Warm call transfers between agents
- 👥 Conference call capabilities
- 🎙️ Call recording
- 📱 Outbound call initiation
- 📋 Call history tracking

### Agent Features
- 👤 Agent status management (Available, Busy, Offline)
- 🔔 Real-time notifications for incoming calls
- 📊 Call duration tracking
- 📝 Call notes and documentation

### Real-time Updates
- ⚡ WebSocket integration for instant updates
- 🔄 Live agent status changes
- 📊 Real-time call metrics

## Technology Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)
  - Socket.IO Client
  - Lucide React (Icons)

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - Socket.IO
  - Twilio SDK
  - Zod (Validation)

## Prerequisites

Before you begin, ensure you have:

1. Node.js (v18 or higher)
2. A Twilio account with:
   - Account SID
   - Auth Token
   - Twilio Phone Number
3. ngrok (for local development)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd call-center-dashboard
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
BASE_URL=http://localhost:3000
```

### 3. Twilio Configuration

1. Log in to your [Twilio Console](https://www.twilio.com/console)
2. Get your Account SID and Auth Token
3. Purchase or select a Twilio phone number
4. Set up your voice webhook URL (use ngrok for local development)

### 4. Start the Development Server

```bash
npm run dev
```

This will start both the frontend (port 5173) and backend (port 3000) servers.

### 5. Expose Local Server (for Twilio Webhooks)

```bash
ngrok http 3000
```

Update your Twilio voice webhook URL with the ngrok URL.

## API Documentation

### REST Endpoints

#### Call Management
- `POST /api/calls/dial`
  - Make outbound calls
  - Body: `{ to: string, agentId: string }`

- `POST /api/calls/:callSid/transfer`
  - Transfer active calls
  - Body: `{ targetAgentId: string }`

- `POST /api/calls/:callSid/conference`
  - Create conference calls
  - Body: `{ participants: string[] }`

- `POST /api/calls/:callSid/record`
  - Start call recording
  - Params: `callSid`

### WebSocket Events

#### Emitted Events
- `call:created` - New call initiated
- `call:transferred` - Call transferred to another agent
- `call:conference:created` - Conference call created
- `call:recording:started` - Call recording started
- `agent:status:updated` - Agent status changes

#### Listening Events
- `agent:status` - Update agent status
- `call:answer` - Agent answers call
- `call:end` - End active call

## Development Guidelines

### Code Structure

```
├── server/
│   ├── handlers/
│   │   └── call-handler.ts
│   ├── index.ts
│   └── websocket.ts
├── src/
│   ├── components/
│   ├── store/
│   ├── types/
│   └── App.tsx
```

### Adding New Features

1. Create necessary backend endpoints in `server/index.ts`
2. Implement handler logic in `server/handlers/`
3. Add corresponding frontend components in `src/components/`
4. Update state management in `src/store/`
5. Add TypeScript types in `src/types/`

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the backend to your preferred hosting service (e.g., Heroku, AWS)
3. Update environment variables on your hosting platform
4. Update Twilio webhook URLs to point to your production server

## Security Considerations

- Keep your Twilio credentials secure
- Use environment variables for sensitive data
- Implement proper authentication for your agents
- Secure WebSocket connections
- Follow Twilio's security best practices

## Troubleshooting

### Common Issues

1. **Calls not connecting**
   - Verify Twilio credentials
   - Check webhook URL configuration
   - Ensure ngrok is running (for local development)

2. **WebSocket disconnections**
   - Check network connectivity
   - Verify CORS configuration
   - Review client connection settings

3. **Missing real-time updates**
   - Confirm WebSocket connection
   - Check event emission and listening
   - Verify Socket.IO configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.