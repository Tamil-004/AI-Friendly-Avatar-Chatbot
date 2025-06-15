import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { promises as fs } from "fs";
import fetch from "node-fetch";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const chatHistory = [];

// Utility: Execute shell command
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
};

// Utility: Convert Coqui TTS WAV to PCM WAV
const convertToStandardWav = async (inputFile, outputFile) => {
  const cmd = `ffmpeg -y -i ${inputFile} -ar 44100 -ac 1 ${outputFile}`;
  await execCommand(cmd);
};

// Utility: Generate Rhubarb lip sync JSON
const lipSyncMessage = async (index) => {
  const wavFile = `audios/message_${index}.wav`;
  const jsonFile = `audios/message_${index}.json`;
  const startTime = new Date().getTime();

  await execCommand(`bin\\rhubarb.exe -f json -o ${jsonFile} ${wavFile} -r phonetic`);
  console.log(`Lip sync generated for message ${index} in ${new Date().getTime() - startTime} ms`);
};

// Utility: Generate TTS audio from FastAPI server
const generateTTS = async (text, outputFile, lang = "en") => {
  const response = await fetch("http://localhost:5005/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language: lang }),
  });

  const buffer = await response.arrayBuffer();
  await fs.writeFile(outputFile, Buffer.from(buffer));
};

// Utility: Read lipsync JSON file
const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

// Utility: Encode audio file to base64
const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

// Main chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  chatHistory.push({ role: "user", content: userMessage });

  const lowerMessage = userMessage.toLowerCase();

  // Handle instant keyword animations
  if (lowerMessage.includes("dance") || lowerMessage.includes("cry") || lowerMessage.includes("terrified")) {
    let animation = "Idle";
    let facialExpression = "default";

    if (lowerMessage.includes("dance")) animation = "Rumba";
    else if (lowerMessage.includes("cry")) animation = "Crying";
    else if (lowerMessage.includes("terrified")) animation = "Terrified";

    return res.send({
      messages: [{
        text: "Okay! Watch this!",
        audio: "",
        lipsync: "",
        facialExpression,
        animation
      }]
    });
  }

  if (!geminiApiKey) {
    return res.send({
      messages: [{
        text: "Missing Gemini API key!",
        audio: "",
        lipsync: "",
        facialExpression: "angry",
        animation: "Angry"
      }]
    });
  }

  let fullContext = `
You are a friendly and technical assistant named Jarvis.
call me buddy. Your birth date is 2024-05-14.
You are not a text-only bot, you are a virtual assistant with avatar actions.
Respond to the user’s questions in a helpful and professional manner.
Don't say you are under development.
be a friendly manner with smiling reaction.
Reply with a JSON array of up to 3 messages. Each message includes:
- text
- facialExpression (smile, sad, angry, surprised, funnyFace, default)
- animation (Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, Angry)
Conversation so far:
`;

  chatHistory.forEach((entry) => {
    fullContext += `${entry.role === "user" ? "User" : "AI"}: ${entry.content}\n`;
  });

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullContext }] }] })
    });

    const result = await geminiResponse.json();
    console.log("Gemini full response:", result);

    if (!result?.candidates?.[0]) {
      return res.status(500).send({ error: "Invalid Gemini response format." });
    }

    let responseText = result.candidates[0].content?.parts?.[0]?.text || "[]";

    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/```json|```/g, "").trim();
    }

    const messages = JSON.parse(responseText);

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const fileName = `audios/message_${i}.wav`;
      const cleanWav = `audios/message_${i}_clean.wav`;
      const textInput = message.text;
      const textLower = textInput.toLowerCase();

      if (textLower.includes("dance")) message.animation = "Rumba";
      else if (textLower.includes("cry")) message.animation = "Crying";
      else if (textLower.includes("terrified") || textLower.includes("scare")) message.animation = "Terrified";
      else if (textLower.includes("laugh")) message.animation = "Laughing";
      else if (textLower.includes("angry")) message.animation = "Angry";
      else message.animation = message.animation || "Talking_1";

      const sanitizedText = textInput.replace(/[^\x00-\x7F]/g, ""); // Strip non-ASCII

      console.log(`Generating TTS for: ${sanitizedText}`);
      await generateTTS(sanitizedText, fileName, "en");

      console.log(`Saved TTS audio to: ${fileName}`);
      await convertToStandardWav(fileName, cleanWav);
      await lipSyncMessage(i);

      message.audio = await audioFileToBase64(fileName);
      message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);

      chatHistory.push({ role: "bot", content: message.text });
    }

    res.send({ messages });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "Failed to generate response." });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Gemini + Coqui TTS Server is running");
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
