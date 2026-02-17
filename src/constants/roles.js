const ROLES = {
  VOLUNTEER: 'volunteer',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.ORGANIZER]: 2,
  [ROLES.VOLUNTEER]: 1,
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
};
