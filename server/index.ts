import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import twilio from 'twilio';
import { config } from 'dotenv';
import { z } from 'zod';
import { CallHandler } from './handlers/call-handler';
import { setupWebSocket } from './websocket';

// Load environment variables
config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize handlers
const callHandler = new CallHandler(twilioClient, io);

// Setup WebSocket
setupWebSocket(io, callHandler);

// Twilio webhook for incoming calls
app.post('/webhook/voice', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  
  // Add your initial call handling logic here
  response.say('Welcome to our call center. Please wait while we connect you with an agent.');
  
  // Enqueue the call
  response.enqueue('support');
  
  res.type('text/xml');
  res.send(response.toString());
});

// API Routes
app.post('/api/calls/dial', async (req, res) => {
  try {
    const schema = z.object({
      to: z.string(),
      agentId: z.string()
    });

    const { to, agentId } = schema.parse(req.body);
    const call = await callHandler.makeOutboundCall(to, agentId);
    res.json(call);
  } catch (error) {
    console.error('Error making outbound call:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.post('/api/calls/:callSid/transfer', async (req, res) => {
  try {
    const schema = z.object({
      targetAgentId: z.string()
    });

    const { targetAgentId } = schema.parse(req.body);
    const { callSid } = req.params;
    
    await callHandler.transferCall(callSid, targetAgentId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error transferring call:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.post('/api/calls/:callSid/conference', async (req, res) => {
  try {
    const schema = z.object({
      participants: z.array(z.string())
    });

    const { participants } = schema.parse(req.body);
    const { callSid } = req.params;
    
    await callHandler.createConference(callSid, participants);
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating conference:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.post('/api/calls/:callSid/record', async (req, res) => {
  try {
    const { callSid } = req.params;
    const recording = await callHandler.startRecording(callSid);
    res.json(recording);
  } catch (error) {
    console.error('Error starting recording:', error);
    res.status(400).json({ error: 'Failed to start recording' });
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});