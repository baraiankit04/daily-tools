import { useState } from "react";
import SEO from "../components/SEO";

function AIPromptGenerator() {
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");

  const generatePrompt = () => {
    if (!task.trim()) {
      alert("Please tell us what you want AI to do.");
      return;
    }

    const generated = `Act as an expert assistant.

Task:
${task.trim()}

Context:
${context.trim() || "No additional context provided."}

Tone:
${tone}

Output format:
${output.trim() || "Provide a clear, practical and well-structured answer."}

Requirements:
- Give an accurate and useful response.
- Keep the answer easy to understand.
- Avoid unnecessary information.
- Use headings or bullet points when they improve clarity.
- If important information is missing, clearly state any assumption instead of inventing facts.`;

    setPrompt(generated);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    alert("Prompt copied.");
  };

  return (
    <>
      <SEO
        title="AI Prompt Generator - Create Better AI Prompts Free"
        description="Create clear and structured prompts for ChatGPT and other AI assistants with this free AI prompt generator."
        keywords="AI prompt generator, ChatGPT prompt generator, prompt maker, AI prompts, create ChatGPT prompt"
      />

      <div className="tool-page">
        <div className="container">
          <div className="tool-page-heading">
            <span className="section-eyebrow">
              AI TOOL
            </span>

            <h1>AI Prompt Generator</h1>

            <p>
              Turn a simple idea into a clear and detailed
              AI prompt.
            </p>
          </div>

          <div
            className="card border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  What do you want AI to do?
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Example: Create a 30-day Instagram content plan for my AC repair business"
                  value={task}
                  onChange={(e) =>
                    setTask(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Additional Context
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Optional: audience, business, location, goal, budget..."
                  value={context}
                  onChange={(e) =>
                    setContext(e.target.value)
                  }
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Tone
                  </label>

                  <select
                    className="form-select"
                    value={tone}
                    onChange={(e) =>
                      setTone(e.target.value)
                    }
                  >
                    <option>Professional</option>
                    <option>Simple</option>
                    <option>Friendly</option>
                    <option>Formal</option>
                    <option>Persuasive</option>
                    <option>Creative</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Output Format
                  </label>

                  <input
                    className="form-control"
                    placeholder="Example: Step-by-step plan"
                    value={output}
                    onChange={(e) =>
                      setOutput(e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                className="btn btn-primary w-100 py-3 fw-semibold mt-4"
                onClick={generatePrompt}
              >
                <i className="bi bi-stars me-2"></i>
                Generate Prompt
              </button>

              {prompt && (
                <div className="mt-4">
                  <label className="form-label fw-semibold">
                    Your AI Prompt
                  </label>

                  <textarea
                    className="form-control bg-light"
                    rows="14"
                    readOnly
                    value={prompt}
                  />

                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={copyPrompt}
                  >
                    <i className="bi bi-copy me-2"></i>
                    Copy Prompt
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="seo-content">
            <h2>Free AI Prompt Generator</h2>
            <p>
              Create structured prompts for ChatGPT and
              other AI assistants from a simple task,
              context, tone and desired output format.
            </p>

            <h2>How to write a better AI prompt?</h2>
            <p>
              Clearly explain the task, provide useful
              context, choose the desired tone and describe
              the format you want the AI to return.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AIPromptGenerator;