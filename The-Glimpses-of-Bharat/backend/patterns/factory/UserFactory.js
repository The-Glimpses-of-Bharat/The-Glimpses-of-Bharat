const {
    AdminStrategy,
    ContributorStrategy,
    PremiumStrategy,
    UserStrategy,
  } = require("../strategy/RoleStrategy");
  
  class UserFactory {
    static getStrategy(role) {
      switch (role) {
        case "admin":
          return new AdminStrategy();
        case "contributor":
          return new ContributorStrategy();
        case "premium":
          return new PremiumStrategy();
        default:
          return new UserStrategy();
      }
    }
  }
  
  module.exports = UserFactory;