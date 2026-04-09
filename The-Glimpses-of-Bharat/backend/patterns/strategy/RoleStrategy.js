class RoleStrategy {
    getPermissions() {
      return [];
    }
  }
  
  class AdminStrategy extends RoleStrategy {
    getPermissions() {
      return ["manage_users", "manage_content"];
    }
  }
  
  class ContributorStrategy extends RoleStrategy {
    getPermissions() {
      return ["add_content", "edit_content"];
    }
  }
  
  class PremiumStrategy extends RoleStrategy {
    getPermissions() {
      return ["access_premium"];
    }
  }
  
  class UserStrategy extends RoleStrategy {
    getPermissions() {
      return ["view_content"];
    }
  }
  
  module.exports = {
    AdminStrategy,
    ContributorStrategy,
    PremiumStrategy,
    UserStrategy,
  };