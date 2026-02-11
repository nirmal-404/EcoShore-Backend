class User {
  constructor({ id, email, password, googleId, role, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.googleId = googleId;
    this.role = role || 'volunteer';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

// Static method to validate user role
  static isValidRole(role) {
    const validRoles = ['admin', 'collector', 'organizer', 'volunteer'];
    return validRoles.includes(role);
  }

// Method to check if user has a specific role
  hasRole(role) {
    return this.role === role;
  }

// Method to check if user has any of the specified roles
  hasAnyRole(roles) {
    return roles.includes(this.role);
  }

// Method to return a safe object representation (without sensitive info)
  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

// Method to check if user is authenticated via Google
  isGoogleUser() {
    return !!this.googleId;
  }
}

module.exports = User;
