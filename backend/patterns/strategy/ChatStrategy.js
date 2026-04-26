/**
 * Abstract Strategy for AI Chat
 */
class ChatStrategy {
    async generateResponse(query, context, appInfo) {
        throw new Error("Method 'generateResponse()' must be implemented.");
    }
}

/**
 * Gemini Strategy implementation
 */
class GeminiStrategy extends ChatStrategy {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }

    async generateResponse(query, context, appInfo) {
        if (!this.apiKey || this.apiKey === "placeholder") {
            return `Mock Response (Gemini): ${query}`;
        }

        try {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(this.apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = this._buildPrompt(query, context, appInfo);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "I'm sorry, I'm having trouble connecting to Gemini.";
        }
    }

    _buildPrompt(query, context, appInfo) {
        return `
        You are the official AI Assistant for "The Glimpses of Bharat" website.
        
        RULES:
        1. DATABASE CHECK: First, check the "Database Context" below for info about freedom fighters.
        2. FALLBACK: If the freedom fighter is NOT in the database, start your answer with: "This website doesn't have information about this freedom fighter yet, but based on my search I found..." and then provide the answer from your general knowledge.
        3. APP KNOWLEDGE: If the user asks about the app (how to contribute, premium, navigation, map), use the "App Info" provided below.
        4. TONE: Be respectful, patriotic, and helpful.

        ---
        DATABASE CONTEXT (Freedom Fighters):
        ${context}

        ---
        APP INFO (Website Features):
        ${appInfo}

        ---
        USER QUESTION: ${query}
        `;
    }
}

/**
 * Groq Strategy implementation
 */
class GroqStrategy extends ChatStrategy {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }

    async generateResponse(query, context, appInfo) {
        if (!this.apiKey || this.apiKey === "placeholder") {
            return `Mock Response (Groq): I see you're asking about "${query}". (Add your GROQ_API_KEY to see real answers!)`;
        }

        try {
            const Groq = require("groq-sdk");
            const groq = new Groq({ apiKey: this.apiKey });

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are the official AI Assistant for "The Glimpses of Bharat" website.
                        
                        RULES:
                        1. DATABASE CHECK: First, check the "Database Context" for info about freedom fighters.
                        2. FALLBACK: If the freedom fighter is NOT in the database, start your answer with: "This website doesn't have information about this freedom fighter yet, but based on my search I found..." and then provide the answer from your knowledge.
                        3. APP KNOWLEDGE: If the user asks about the app (how to contribute, premium, navigation, map), use the "App Info" provided.
                        
                        ---
                        DATABASE CONTEXT:
                        ${context}

                        ---
                        APP INFO:
                        ${appInfo}`
                    },
                    {
                        role: "user",
                        content: query
                    }
                ],
                model: "llama-3.3-70b-versatile",
            });

            return completion.choices[0]?.message?.content || "No response generated.";
        } catch (error) {
            console.error("Groq API Error:", error);
            return "I'm sorry, I'm having trouble connecting to Groq.";
        }
    }
}

module.exports = { ChatStrategy, GeminiStrategy, GroqStrategy };
