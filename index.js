require("dotenv").config();
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;
const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Chat GPT integration
app.post("/", async (req, res) => {
  const { message } = req.body;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });

  if (response.data) {
    if (response.data.choices) {
        res.json({ message: response.data.choices[0].message.content });
    }
  }
});

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
