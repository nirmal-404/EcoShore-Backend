const agentRepository = require('../repository/agent.repository');
const { registerAgent } = require('./auth.service');
const { Beach, WasteRecord } = require('../models');
const { NotFoundError, AuthorizationError } = require('../utils/AppError');

class AgentService {
  // Admin: register a new beach agent
  async createAgent(agentData) {
    return registerAgent(agentData);
  }

  // Admin: list all agents
  async getAllAgents() {
    return agentRepository.findAllAgents();
  }

  // Admin: get single agent profile
  async getAgentById(agentId) {
    const agent = await agentRepository.findAgentById(agentId);
    if (!agent) throw new NotFoundError('Agent');
    return agent;
  }

  // Admin: delete an agent (hard delete — existing waste records remain)
  async deleteAgent(agentId) {
    const agent = await agentRepository.findAgentById(agentId);
    if (!agent) throw new NotFoundError('Agent');
    await agentRepository.delete(agentId);
    return agent;
  }

  // Admin: reassign agent to a different beach
  async reassignAgent(agentId, newBeachId) {
    const agent = await agentRepository.findAgentById(agentId);
    if (!agent) throw new NotFoundError('Agent');

    const beach = await Beach.findById(newBeachId);
    if (!beach || !beach.isActive) throw new NotFoundError('Beach');

    return agentRepository.update(agentId, { assignedBeach: newBeachId });
  }

  // Agent portal: submit a waste record
  // Beach is always resolved from DB (not JWT) to handle mid-session reassignment
  async submitWasteRecord(agentUser, wasteData) {
    const freshAgent = await agentRepository.findAgentById(agentUser.id);
    if (!freshAgent) throw new NotFoundError('Agent');

    if (!freshAgent.assignedBeach) {
      throw new AuthorizationError(
        'You are not assigned to any beach. Contact admin.'
      );
    }

    const beach = await Beach.findById(freshAgent.assignedBeach);
    if (!beach || !beach.isActive) {
      throw new AuthorizationError(
        'Your assigned beach is no longer active. Contact admin.'
      );
    }

    const record = new WasteRecord({
      ...wasteData,
      beachId: freshAgent.assignedBeach,
      recordedBy: agentUser.id,
    });

    await record.save();
    return record;
  }

  // Agent portal: view own submission history
  async getMySubmissions(agentUser, query = {}) {
    const { page = 1, limit = 20 } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      beachId: agentUser.assignedBeach,
      recordedBy: agentUser.id,
    };

    const [records, total] = await Promise.all([
      WasteRecord.find(filter)
        .sort({ collectionDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('beachId', 'name location.city'),
      WasteRecord.countDocuments(filter),
    ]);

    return {
      records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new AgentService();
