const IChatProvider = require('../interfaces/IChatProvider');
const logger = require('../config/logger');

/**
 * FirebaseChatProvider (SOLID - Single Responsibility)
 * Handles all Firebase Realtime Database operations for chat
 * Implements IChatProvider interface
 *
 * Requirements:
 * - npm install firebase-admin
 * - Firebase service account key at: config/firebase-service-account.json
 * - FIREBASE_DATABASE_URL in .env
 */

class FirebaseChatProvider extends IChatProvider {
  constructor() {
    super();
    this.db = null;
    this.initialized = false;
  }

  /**
   * Initialize Firebase Admin SDK
   */
  initialize() {
    if (this.initialized) return;

    try {
      // Firebase Admin SDK initialization
      const admin = require('firebase-admin');
      const serviceAccount = require('../../config/firebase-service-account.json');
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL
        });
      }
      
      this.db = admin.database();
      this.initialized = true;

      logger.info('Firebase initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Firebase:', error);
      throw error;
    }
  }

  /**
   * Send a message to Firebase
   * Structure: /chats/{chatGroupId}/messages/{messageId}
   */
  async sendMessage(chatGroupId, messageData) {
    this.initialize();

    const message = {
      senderId: messageData.senderId,
      text: messageData.text || '',
      mediaUrl: messageData.mediaUrl || null,
      createdAt: new Date().toISOString(),
      seenBy: [messageData.senderId], // Sender has seen it
    };

    // Firebase implementation
    const messageRef = this.db.ref(`chats/${chatGroupId}/messages`).push();
    await messageRef.set(message);
    
    return {
      id: messageRef.key,
      ...message
    };
  }

  /**
   * Get messages from Firebase
   */
  async getMessages(chatGroupId, options = {}) {
    this.initialize();

    const { limit = 50, lastMessageId = null } = options;

    // Firebase implementation
    let query = this.db
      .ref(`chats/${chatGroupId}/messages`)
      .orderByChild('createdAt')
      .limitToLast(limit);
    
    if (lastMessageId) {
      // Implement pagination with lastMessageId
      // For future enhancement
    }
    
    const snapshot = await query.once('value');
    const messages = [];
    
    snapshot.forEach((child) => {
      messages.push({
        id: child.key,
        ...child.val()
      });
    });
    
    return messages;
  }

  /**
   * Delete a message from Firebase
   */
  async deleteMessage(chatGroupId, messageId) {
    this.initialize();

    // Firebase implementation
    await this.db.ref(`chats/${chatGroupId}/messages/${messageId}`).remove();
    logger.info(`Deleted message ${messageId} from chat ${chatGroupId}`);
  }

  /**
   * Mark message as seen
   */
  async markMessageSeen(chatGroupId, messageId, userId) {
    this.initialize();

    // Firebase implementation
    const messageRef = this.db.ref(`chats/${chatGroupId}/messages/${messageId}`);
    const snapshot = await messageRef.once('value');
    const message = snapshot.val();
    
    if (message && message.seenBy) {
      if (!message.seenBy.includes(userId)) {
        message.seenBy.push(userId);
        await messageRef.update({ seenBy: message.seenBy });
      }
    }
    
    logger.info(`Message ${messageId} marked as seen by user ${userId}`);
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(chatGroupId, userId) {
    this.initialize();

    // Firebase implementation
    const snapshot = await this.db
      .ref(`chats/${chatGroupId}/messages`)
      .once('value');
    
    let unreadCount = 0;
    snapshot.forEach((child) => {
      const message = child.val();
      if (message.seenBy && !message.seenBy.includes(userId)) {
        unreadCount++;
      }
    });
    
    return unreadCount;
  }
}

module.exports = new FirebaseChatProvider();
