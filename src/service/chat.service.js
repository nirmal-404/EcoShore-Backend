const ChatGroup = require('../models/ChatGroup');
const User = require('../models/User');
const firebaseChatProvider = require('../providers/FirebaseChatProvider');
const { AppError } = require('../utils/AppError');
const { validateObjectId } = require('../utils/validators');
const { ROLES } = require('../constants/roles');

/**
 * ChatService (SOLID - Single Responsibility)
 * Handles business logic for chat groups
 * Depends on IChatProvider abstraction (Dependency Inversion)
 */
class ChatService {
  constructor(chatProvider) {
    this.chatProvider = chatProvider;
  }

  /**
   * Create a chat group
   */
  async createChatGroup(data, creatorId) {
    const { name, description, type, eventId } = data;

    // Validate eventId if provided
    if (eventId) {
      validateObjectId(eventId, 'Event ID');
    }

    const chatGroup = await ChatGroup.create({
      name,
      description,
      type,
      eventId,
      members: [creatorId],
      admins: [creatorId],
    });

    return chatGroup;
  }

  /**
   * Get chat group by ID
   */
  async getChatGroupById(groupId) {
    validateObjectId(groupId, 'Chat Group ID');

    const group = await ChatGroup.findById(groupId)
      .populate('members', 'name email')
      .populate('admins', 'name email')
      .lean();

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    return group;
  }

  /**
   * Get user's chat groups
   */
  async getUserChatGroups(userId) {
    validateObjectId(userId, 'User ID');

    const groups = await ChatGroup.find({
      members: userId,
      isActive: true,
    })
      .populate('admins', 'name email')
      .sort({ updatedAt: -1 })
      .lean();

    return groups;
  }

  /**
   * Add member to chat group
   */
  async addMember(groupId, userId, requesterId) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(userId, 'User ID');

    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    // Check if requester is admin
    if (!group.admins.some((admin) => admin.toString() === requesterId)) {
      throw new AppError('Only group admins can add members', 403);
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if already a member
    if (group.members.some((member) => member.toString() === userId)) {
      throw new AppError('User is already a member', 400);
    }

    group.members.push(userId);
    await group.save();

    return group;
  }

  /**
   * Remove member from chat group
   */
  async removeMember(groupId, userId, requesterId) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(userId, 'User ID');

    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    // Check if requester is admin or removing themselves
    const isAdmin = group.admins.some(
      (admin) => admin.toString() === requesterId
    );
    const isSelf = userId === requesterId;

    if (!isAdmin && !isSelf) {
      throw new AppError('Unauthorized to remove this member', 403);
    }

    // Remove from members
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );

    // Also remove from admins if present
    group.admins = group.admins.filter((admin) => admin.toString() !== userId);

    await group.save();

    return group;
  }

  /**
   * Promote member to admin
   */
  async promoteToAdmin(groupId, userId, requesterId) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(userId, 'User ID');

    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    // Check if requester is admin
    if (!group.admins.some((admin) => admin.toString() === requesterId)) {
      throw new AppError('Only group admins can promote members', 403);
    }

    // Check if user is a member
    if (!group.members.some((member) => member.toString() === userId)) {
      throw new AppError('User is not a member of this group', 400);
    }

    // Check if already an admin
    if (group.admins.some((admin) => admin.toString() === userId)) {
      throw new AppError('User is already an admin', 400);
    }

    group.admins.push(userId);
    await group.save();

    return group;
  }

  /**
   * Send message (delegates to Firebase provider)
   */
  async sendMessage(groupId, senderId, messageData) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(senderId, 'Sender ID');

    // Verify group exists and user is a member
    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    if (!group.members.some((member) => member.toString() === senderId)) {
      throw new AppError('You are not a member of this group', 403);
    }

    // Delegate to Firebase provider
    const message = await this.chatProvider.sendMessage(groupId, {
      senderId,
      text: messageData.text,
      mediaUrl: messageData.mediaUrl,
    });

    // Update group's updatedAt
    group.updatedAt = new Date();
    await group.save();

    return message;
  }

  /**
   * Get messages (delegates to Firebase provider)
   */
  async getMessages(groupId, userId, options = {}) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(userId, 'User ID');

    // Verify user is a member
    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    if (!group.members.some((member) => member.toString() === userId)) {
      throw new AppError('You are not a member of this group', 403);
    }

    // Delegate to Firebase provider
    const messages = await this.chatProvider.getMessages(groupId, options);

    return messages;
  }

  /**
   * Delete message (delegates to Firebase provider)
   */
  async deleteMessage(groupId, messageId, userId) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(userId, 'User ID');

    // Verify user is admin
    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    if (!group.admins.some((admin) => admin.toString() === userId)) {
      throw new AppError('Only group admins can delete messages', 403);
    }

    // Delegate to Firebase provider
    await this.chatProvider.deleteMessage(groupId, messageId);

    return { message: 'Message deleted successfully' };
  }

  /**
   * Mark message as seen (delegates to Firebase provider)
   */
  async markMessageSeen(groupId, messageId, userId) {
    validateObjectId(groupId, 'Chat Group ID');
    validateObjectId(userId, 'User ID');

    // Verify user is a member
    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new AppError('Chat group not found', 404);
    }

    if (!group.members.some((member) => member.toString() === userId)) {
      throw new AppError('You are not a member of this group', 403);
    }

    // Delegate to Firebase provider
    await this.chatProvider.markMessageSeen(groupId, messageId, userId);

    return { message: 'Message marked as seen' };
  }

  /**
   * Auto-add user to GLOBAL_VOLUNTEER group (called when user registers)
   */
  async addToGlobalVolunteerGroup(userId) {
    validateObjectId(userId, 'User ID');

    // Find or create global volunteer group
    let globalGroup = await ChatGroup.findOne({
      type: 'GLOBAL_VOLUNTEER',
    });

    if (!globalGroup) {
      globalGroup = await ChatGroup.create({
        name: 'Global Volunteer Chat',
        description: 'Chat group for all volunteers',
        type: 'GLOBAL_VOLUNTEER',
        members: [],
        admins: [],
      });
    }

    // Add user if not already a member
    if (!globalGroup.members.some((member) => member.toString() === userId)) {
      globalGroup.members.push(userId);
      await globalGroup.save();
    }

    return globalGroup;
  }

  /**
   * Auto-add user to ORGANIZER_PRIVATE group (called when organizer approved)
   */
  async addToOrganizerPrivateGroup(userId) {
    validateObjectId(userId, 'User ID');

    // Find or create organizer private group
    let organizerGroup = await ChatGroup.findOne({
      type: 'ORGANIZER_PRIVATE',
    });

    if (!organizerGroup) {
      organizerGroup = await ChatGroup.create({
        name: 'Organizer Private Chat',
        description: 'Private chat group for organizers',
        type: 'ORGANIZER_PRIVATE',
        members: [],
        admins: [],
      });
    }

    // Add user if not already a member
    if (
      !organizerGroup.members.some((member) => member.toString() === userId)
    ) {
      organizerGroup.members.push(userId);
      await organizerGroup.save();
    }

    return organizerGroup;
  }
}

module.exports = new ChatService(firebaseChatProvider);
