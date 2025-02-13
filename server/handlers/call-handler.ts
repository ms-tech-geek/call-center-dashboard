import { Twilio } from 'twilio';
import { Server } from 'socket.io';

export class CallHandler {
  constructor(
    private twilioClient: Twilio,
    private io: Server
  ) {}

  async makeOutboundCall(to: string, agentId: string) {
    try {
      // Validate phone number format
      if (!to.match(/^\+91\d{10}$/)) {
        throw new Error('Invalid Indian phone number format');
      }

      const call = await this.twilioClient.calls.create({
        url: `${process.env.BASE_URL}/webhook/voice`,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: `${process.env.BASE_URL}/webhook/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
      });

      // Notify connected clients about the new call
      this.io.emit('call:created', {
        id: call.sid,
        status: call.status,
        phoneNumber: to,
        startTime: new Date(),
        duration: 0,
        agentId
      });

      return call;
    } catch (error) {
      console.error('Error making outbound call:', error);
      throw error;
    }
  }

  async transferCall(callSid: string, targetAgentId: string) {
    try {
      // Get agent's client name from your system
      const targetClientName = `client:${targetAgentId}`;

      await this.twilioClient.calls(callSid)
        .update({
          twiml: `
            <Response>
              <Dial>
                <Client>${targetClientName}</Client>
              </Dial>
            </Response>
          `
        });

      this.io.emit('call:transferred', {
        callSid,
        targetAgentId
      });
    } catch (error) {
      console.error('Error transferring call:', error);
      throw error;
    }
  }

  async createConference(callSid: string, participants: string[]) {
    try {
      const conference = await this.twilioClient.conferences.create({
        friendlyName: `conf_${callSid}`
      });

      // Add original call to conference
      await this.twilioClient.calls(callSid)
        .update({
          twiml: `
            <Response>
              <Dial>
                <Conference>${conference.sid}</Conference>
              </Dial>
            </Response>
          `
        });

      // Add each participant to the conference
      for (const participantId of participants) {
        await this.twilioClient.calls
          .create({
            to: `client:${participantId}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            twiml: `
              <Response>
                <Dial>
                  <Conference>${conference.sid}</Conference>
                </Dial>
              </Response>
            `
          });
      }

      this.io.emit('call:conference:created', {
        callSid,
        conferenceSid: conference.sid,
        participants
      });

      return conference;
    } catch (error) {
      console.error('Error creating conference:', error);
      throw error;
    }
  }

  async startRecording(callSid: string) {
    try {
      const recording = await this.twilioClient
        .calls(callSid)
        .recordings
        .create();

      this.io.emit('call:recording:started', {
        callSid,
        recordingSid: recording.sid
      });

      return recording;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }
}