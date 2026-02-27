import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function checkModels() {
  try {
    const response = await openai.models.list(); // use models.list()
    const modelIds = response.data.map(model => model.id);
    console.log("Available models:", modelIds);

    if (modelIds.includes("gpt-4") || modelIds.includes("gpt-4-32k")) {
      console.log("GPT-4 available");
    } else {
      console.log("GPT-4 not available");
    }
  } catch (err) {
    console.error("Error:", err);
    
  }
}

checkModels();
