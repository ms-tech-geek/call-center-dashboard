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
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Add security middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:5173'
  );
  next();
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

// Voice webhook for incoming calls
app.post('/voice', (req, res) => {
  const { CallSid, From, CallStatus } = req.body;
  console.log('Incoming call webhook received:', { CallSid, From, CallStatus });
  
  const response = new twilio.twiml.VoiceResponse();
  
  response.say({ voice: 'alice' }, 'Welcome to our call center.');
  response.pause({ length: 1 });
  response.say({ voice: 'alice' }, 'Please wait while we connect you with an available agent.');
  
  // Emit incoming call event
  const callData = {
    callSid: CallSid,
    from: From || 'anonymous',
    status: "incoming",
    startTime: new Date()
  };
  
  console.log('Emitting incoming call event:', callData);
  io.emit('incoming_call', callData);
  
  // Queue the call
  response.enqueue('support');
  
  res.type('text/xml');
  res.send(response.toString());
});

// Outbound call endpoint
app.post('/call', async (req, res) => {
  try {
    const { to } = req.body;
    
    if (!to.match(/^\+91\d{10}$/)) {
      throw new Error('Invalid Indian phone number format');
    }

    // Use demo TwiML URL for testing
    const twimlUrl = 'https://demo.twilio.com/welcome/voice/';

    const call = await twilioClient.calls.create({
      url: twimlUrl,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    io.emit("new_call", { 
      callSid: call.sid, 
      to, 
      status: "initiated" 
    });

    res.json({ 
      message: "Call initiated", 
      callSid: call.sid 
    });
  } catch (error) {
    console.error('Error making outbound call:', error);
    res.status(500).json({ error: error.message });
  }
});

// Status callback endpoint
app.post('/status', (req, res) => {
  const { CallSid, CallStatus } = req.body;
  console.log('Call status update:', { CallSid, CallStatus });
  
  const statusData = { callSid: CallSid, status: CallStatus };
  io.emit("call_status", statusData);
  
  res.sendStatus(200);
});

// Call logs endpoint
app.get('/call-logs', async (req, res) => {
  try {
    const calls = await twilioClient.calls.list({ limit: 50 });
    const callLogs = calls.map(call => ({
      sid: call.sid,
      from: call.from,
      to: call.to,
      status: call.status,
      duration: call.duration,
      startTime: call.startTime,
    }));
    
    io.emit("call_logs_update", { calls: callLogs });
    res.json({ calls: callLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});