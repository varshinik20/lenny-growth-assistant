import axios from "axios";

const API = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json"
  }
});

export const apiService = {
  // Get all chat sessions
  getSessions: async () => {
    const response = await API.get("/sessions/");
    return response.data;
  },

  // Create a new session
  createSession: async (title = "New Chat") => {
    const response = await API.post("/sessions/", { title });
    return response.data;
  },

  // Send message to the agent
  sendMessage: async (sessionId, message) => {
    const response = await API.post("/chat/", {
      session_id: sessionId,
      message: message
    });
    return response.data; // Expected format: { response: "string content" }
  }
};

export default API;