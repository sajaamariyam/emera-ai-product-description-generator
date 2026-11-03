const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { runProductWorkflow } = require("./workflows/productWorkflow");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Émera AI Backend is running");
});

app.post("/api/run-workflow", async (req, res) => {
  console.log("\n🔥 WORKFLOW REQUEST RECEIVED");
  console.log("WORKFLOW INPUT:", req.body);

  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    const result = await runProductWorkflow({
      name: name.trim(),
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("WORKFLOW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Workflow failed.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
