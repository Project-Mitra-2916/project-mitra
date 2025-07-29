export const generateCodeFromPrompt = async (prompt) => {
  try {
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.error) return { code: "", explanation: data.error };

    return {
      code: data.code || "",
      explanation: data.explanation || "",
    };
  } catch (err) {
    console.error("OpenRouter API Error:", err);
    return {
      code: "",
      explanation: "❌ Failed to generate code. Please try again.",
    };
  }
};
