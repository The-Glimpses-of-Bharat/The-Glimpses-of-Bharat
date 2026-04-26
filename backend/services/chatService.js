const Fighter = require("../models/Fighter");
const { GeminiStrategy, GroqStrategy } = require("../patterns/strategy/ChatStrategy");

class ChatService {
    constructor() {
        if (process.env.GROQ_API_KEY) {
            this.strategy = new GroqStrategy(process.env.GROQ_API_KEY);
        } else if (process.env.GEMINI_API_KEY) {
            this.strategy = new GeminiStrategy(process.env.GEMINI_API_KEY);
        } else {
            this.strategy = new GroqStrategy("placeholder");
        }

        // Information about the application for the AI to use
        this.appInfo = `
        WEBSITE FEATURES & NAVIGATION:
        - Dashboard: The main landing page showing statistics about freedom fighters and users.
        - Freedom Fighters Page: A list where users can view and learn about all approved freedom fighters.
        - Map Feature: A visual map showing where different freedom fighters were born or active across Bharat.
        - Contribution System: Users can contribute by submitting new information about freedom fighters. Admin reviews these in the "Pending Contributions" section.
        - User Roles: 
            * Admin: Full access to manage content and users.
            * Contributor: Can submit new data.
            * Premium: Access to exclusive historical documents and advanced map layers.
        - How to become Premium: Go to the "Profile" or "Settings" section (coming soon) or contact the administrator.
        - Navigation: Use the Sidebar on the left to move between Dashboard, Contributions, Fighters, and Users.
        `;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async processUserQuery(query) {
        // 1. Fetch all approved freedom fighter data
        const fighters = await Fighter.find({ status: "approved" });
        
        const context = fighters.map(f => {
            return `Name: ${f.name}\nDescription: ${f.description}\nContributions: ${f.contributions}\nBirth: ${f.birthYear}, Death: ${f.deathYear}\n---`;
        }).join("\n");

        // 2. Generate response using the strategy, database context, and app info
        const responseText = await this.strategy.generateResponse(query, context, this.appInfo);

        return responseText;
    }
}

module.exports = new ChatService();
