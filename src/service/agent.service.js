const agentRepository = require('../repository/agent.repository');
const { registerAgent } = require('./auth.service');
const { Beach } = require('../models');
const { NotFoundError } = require('../utils/AppError');

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
}

module.exports = new AgentService();
