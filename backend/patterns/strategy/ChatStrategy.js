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
            return JSON.stringify({ type: "text", content: `Mock Gemini: ${query}` });
        }

        try {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(this.apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = this._buildPrompt(query, context, appInfo);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text(); // AI is instructed to return JSON
        } catch (error) {
            return JSON.stringify({ type: "text", content: "Error connecting to Gemini." });
        }
    }

    _buildPrompt(query, context, appInfo) {
        return `
        You are the official AI Assistant for "The Glimpses of Bharat" website.
        
        OUTPUT FORMAT: You MUST return a JSON object with two keys: "type" and "content".
        Types: 
        - "text": For simple conversation.
        - "steps": For directions, how-to guides, or process steps. (Format content as a numbered list).
        - "info": For structured historical data or architecture of the app.

        RULES:
        1. DATABASE CHECK: First check "Database Context".
        2. FALLBACK: If missing in DB, start "content" with: "This website doesn't have info yet, but on web searching I found..."
        3. APP KNOWLEDGE: Use "App Info" for navigation questions.

        DATABASE CONTEXT: ${context}
        APP INFO: ${appInfo}
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
            return JSON.stringify({ type: "text", content: `Mock Groq: ${query}` });
        }

        try {
            const Groq = require("groq-sdk");
            const groq = new Groq({ apiKey: this.apiKey });

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are the AI Assistant for "The Glimpses of Bharat".
                        OUTPUT FORMAT: Return ONLY a valid JSON object: {"type": "text|steps|info", "content": "string"}.
                        
                        - "steps": Use for directions or processes (e.g., how to contribute).
                        - "info": Use for structured history or app architecture.
                        - "text": For everything else.

                        DATABASE: ${context}
                        APP INFO: ${appInfo}`
                    },
                    { role: "user", content: query }
                ],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });

            return completion.choices[0]?.message?.content || JSON.stringify({type:"text", content: "No response."});
        } catch (error) {
            return JSON.stringify({ type: "text", content: "Error connecting to Groq." });
        }
    }
}

module.exports = { ChatStrategy, GeminiStrategy, GroqStrategy };
