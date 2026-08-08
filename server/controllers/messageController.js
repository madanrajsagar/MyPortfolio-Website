import Message from '../models/Message.js';
import { sendContactEmail } from '../services/emailService.js';

// Send a contact message
export const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject and message content',
      });
    }

    const newMessage = await Message.create({ name, email, subject, message });

    // Send email alert asynchronously
    sendContactEmail({ name, email, subject, message }).catch(err =>
      console.error('Failed to send nodemailer alert:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Thank you!',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// Get all messages (Admin only)
export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read (Admin only)
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a message (Admin only)
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
