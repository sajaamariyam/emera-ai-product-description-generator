import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
  });

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workflow, setWorkflow] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setDescription("");
    setWorkflow(null);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/run-workflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
          }),
        }
      );

      const data = await response.json();

      console.log("WORKFLOW RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Workflow failed");
      }

      setDescription(data.description);
      setWorkflow(data.workflow);
    } catch (error) {
      console.error("WORKFLOW ERROR:", error);

      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">


        <div className="header">
          <p className="brand">ÉMERA</p>

          <h1>
            AI Product
            <span>Description Generator</span>
          </h1>

          <p className="subtitle">
            Create elegant, luxury product descriptions using
            an intelligent multi-step AI workflow.
          </p>
        </div>

        <div className="card">


          <div className="card-header">
            <h2>Product Details</h2>

            <p>
              Enter a product name and let the workflow
              retrieve its trusted product information.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="input-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Emerald Mini Bag"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <button
              className="generate-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "✨ Generate Description"}
            </button>

          </form>


          {error && (
            <div className="result">

              <div className="result-header">
                <h2>Error</h2>
              </div>

              <div className="description-box">
                {error}
              </div>

            </div>
          )}


          {description && (
            <div className="result">

              <div className="result-header">
                <h2>AI Generated Description</h2>

                <span>
                  {workflow?.fallbackUsed
                    ? "FALLBACK"
                    : "AI"}
                </span>
              </div>

              <div className="description-box">
                {description}
              </div>

            </div>
          )}

          {workflow && (
            <div className="workflow-box">

              <h2>Agentic Workflow</h2>

              <p className="workflow-subtitle">
                The product description was processed through
                multiple controlled workflow stages.
              </p>

              <div className="workflow-steps">

                <div className="workflow-step">
                  <span>1</span>

                  <div>
                    <strong>Planner</strong>

                    <p>
                      Defined the steps required to complete
                      the task.
                    </p>
                  </div>
                </div>

                <div className="workflow-arrow">↓</div>


                <div className="workflow-step">
                  <span>2</span>

                  <div>
                    <strong>Product Tool</strong>

                    <p>
                      Retrieved trusted product information
                      from the product knowledge source.
                    </p>
                  </div>
                </div>

                <div className="workflow-arrow">↓</div>


                <div className="workflow-step">
                  <span>3</span>

                  <div>
                    <strong>Context Optimization</strong>

                    <p>
                      Selected only the relevant product
                      information for the AI.
                    </p>
                  </div>
                </div>

                <div className="workflow-arrow">↓</div>


                <div className="workflow-step">
                  <span>4</span>

                  <div>
                    <strong>AI Executor</strong>

                    <p>
                      Generated the description using the
                      trusted product context.
                    </p>
                  </div>
                </div>

                <div className="workflow-arrow">↓</div>


                <div className="workflow-step">
                  <span>5</span>

                  <div>
                    <strong>Output Processor</strong>

                    <p>
                      Cleaned and normalized the generated
                      AI output.
                    </p>
                  </div>
                </div>

                <div className="workflow-arrow">↓</div>


                <div className="workflow-step">
                  <span>6</span>

                  <div>
                    <strong>Validator</strong>

                    <p>
                      Checked the description for required
                      information, length, and unsupported claims.
                    </p>
                  </div>
                </div>

                <div className="workflow-arrow">↓</div>


                <div className="workflow-step">
                  <span>7</span>

                  <div>
                    <strong>
                      {workflow.fallbackUsed
                        ? "Fallback Response"
                        : "Final Response"}
                    </strong>

                    <p>
                      {workflow.fallbackUsed
                        ? "Validation failed, so a safe fallback description was returned."
                        : "Validation passed and the final description was returned."}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        <p className="footer">
          Émera · Luxury made intelligent
        </p>

      </div>
    </div>
  );
}

export default App;