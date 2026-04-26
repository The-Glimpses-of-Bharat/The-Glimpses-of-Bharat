const chatService = require("../services/chatService");
const ChatMessage = require("../models/ChatMessage");

exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // 1. Save user's question to DB
    const userMessage = new ChatMessage({
      user: userId,
      role: "user",
      content: question,
    });
    await userMessage.save();

    // 2. Get AI response
    const aiResponse = await chatService.processUserQuery(question);

    // 3. Save AI's response to DB
    const assistantMessage = new ChatMessage({
      user: userId,
      role: "assistant",
      content: aiResponse,
    });
    await assistantMessage.save();

    res.status(200).json({ 
      answer: aiResponse,
      history: [userMessage, assistantMessage]
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Failed to process chat request" });
  }
};

exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await ChatMessage.find({ user: userId }).sort({ timestamp: 1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
};
