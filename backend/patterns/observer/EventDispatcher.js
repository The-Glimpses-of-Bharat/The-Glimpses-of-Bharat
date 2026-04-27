const EventEmitter = require("events");

class PlatformEventDispatcher extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    this.on("userSignup", (user) => {
      // In a real application, this would trigger an email or SMS notification service
      console.log(`[Observer Pattern] Event Received: New User Registered -> ${user.email} (Role: ${user.role})`);
    });

    this.on("fighterApproved", (fighter) => {
      // This could trigger a push notification to users interested in this era
      console.log(`[Observer Pattern] Event Received: Fighter Approved -> ${fighter.name}`);
    });
  }
}

// Export as a Singleton
const dispatcherInstance = new PlatformEventDispatcher();
module.exports = dispatcherInstance;
