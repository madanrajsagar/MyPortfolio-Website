import { queryAIChatbot } from '../services/aiService.js';
import Analytics from '../models/Analytics.js';

// Chat with the portfolio AI Assistant
export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Query message is required',
      });
    }

    // Call chatbot logic
    const answer = await queryAIChatbot(message, history || []);

    // Asynchronously log the AI question to Analytics
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const country = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || 'Unknown';

    Analytics.create({
      eventType: 'aiQuestion',
      target: message.substring(0, 100), // Log the start of the question as target
      ipAddress,
      country,
      userAgent,
    }).catch(err => console.error('Failed to log AI question analytical event:', err.message));

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
};
