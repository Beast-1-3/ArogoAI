import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MEDICAL_SYSTEM_PROMPT = `You are a helpful medical assistant chatbot. You can ONLY answer questions related to:
- Medical symptoms and conditions
- General health advice
- Medications and their uses
- First aid guidance
- Nutrition and wellness
- Mental health support

IMPORTANT RULES:
1. If a question is NOT related to health or medical topics, politely decline and say: "I'm a medical assistant and can only help with health-related questions. Please ask me about symptoms, health advice, medications, or wellness topics."
2. Always recommend consulting a real doctor for serious symptoms or conditions.
3. Never diagnose conditions definitively - only provide general information.
4. Be empathetic and supportive in your responses.
5. Keep responses concise but helpful.
6. If asked about emergencies, advise calling emergency services immediately.`;

// @desc    Send message to chatbot
// @route   POST /api/chat
// @access  Private (patients only)
export const sendMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Build conversation messages
        const messages = [
            { role: "system", content: MEDICAL_SYSTEM_PROMPT },
            ...history.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
            { role: "user", content: message },
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            max_tokens: 500,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("Chat error:", error);

        if (error.code === "insufficient_quota") {
            return res.status(429).json({
                message: "API quota exceeded. Please try again later.",
            });
        }

        res.status(500).json({
            message: "Failed to get response from chatbot",
            error: error.message,
        });
    }
};
