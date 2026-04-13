// agent.js
import axios from "axios";
import { ElevenLabs } from "elevenlabs";

// ✅ Step 1: Define your backend API call
async function send_to_backend(parameters) {
  const { caller, phone, location } = parameters;
  console.log("Collected info:", { caller, phone, location });

  try {
    const response = await axios.post("http://localhost:5001/api/victims", {
      caller,
      phone,
      location,
    });
    console.log("Response from backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending to backend:", error.message);
    return { error: error.message };
  }
}

// ✅ Step 2: Initialize ElevenLabs
const elevenlabs = new ElevenLabs({
  apiKey: "sk_3bb51771e1a16e3c2cbd8dd22a5f027c02ac93ea7b9f3a14", // 🔒 replace with your real API key
});

// ✅ Step 3: Register your tool function
const tools = {
  send_to_backend: async (params) => await send_to_backend(params),
};

// ✅ Step 4: Create a conversation with the agent
async function runAgent() {
  console.log("🚀 Starting ElevenLabs agent session...");

  const conversation = await elevenlabs.conversationalAi.createConversation({
    agentId: "agent_4001k8ndk9dafb7sf7w3kve32xr5", // your agent ID
    tools,
  });

  console.log("✅ Agent connected and listening...");
}

runAgent();



// ✅ Step 2: Register your tool
// const clientTools = new ClientTools({
//   send_to_backend: send_to_backend,
// });

// // ✅ Step 3: Initialize ElevenLabs client & conversation
// const client = new ElevenLabsClient({
//   apiKey: "sk_3bb51771e1a16e3c2cbd8dd22a5f027c02ac93ea7b9f3a14", // replace with your key
// });

// const conversation = new Conversation({
//   client,
//   agentId: "agent_4001k8ndk9dafb7sf7w3kve32xr5", // your ElevenLabs agent ID
//   clientTools,
// });

// // ✅ Step 4: Start the session
// conversation.startSession();
