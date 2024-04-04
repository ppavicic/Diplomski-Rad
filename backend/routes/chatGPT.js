const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: 'org-ayfGnl2VUYoLFy88Eb2QaJZ6',
});

router.post("/", async (req, res) => {
    const prompt = "Bok, možeš li mi generirat tekst za diktat?";

    try {
      const response = await openai.chat.completions.create({
        messages: [{ 
            role: "system", 
            content: prompt 
        }],
        model: "gpt-3.5-turbo",
      });
  
      console.log(response.choices[0]);
  
      return res.status(200).json({
        success: true,
        data: response.choices[0].text,
      });
    } catch (error) {
      if (error.code === 'insufficient_quota') {
        return res.status(429).json({
          success: false,
          error: "You have exceeded your current quota."
        });
      } else {
        return res.status(400).json({
          success: false,
          error: error.response ? error.response.data : "There was an issue on the server",
        });
      }
    }
  });

module.exports = router;