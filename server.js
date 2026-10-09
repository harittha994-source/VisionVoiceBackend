const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/ask", async (req, res) => {

    try {

        const question = req.body.question;

        console.log("Question received:", question);

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: question
                }
            ]
        });

        const answer = response.choices[0].message.content;

        console.log("AI Answer:", answer);

        res.json({
            answer: answer
        });

    } catch (error) {

        console.log("========== GROQ ERROR ==========");
        console.log(error);
        console.log("================================");

        res.status(500).json({
            error: error.message || "Unknown error"
        });
    }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`VisionVoice AI Server running on port ${PORT}`);
});
