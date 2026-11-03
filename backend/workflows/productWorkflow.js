const { getProductInfo } = require("../tools/productTool");
const { generateDescription } = require("../services/aiExecutor");
const { validateDescription } = require("../services/validator");
const { processOutput } = require("../services/outputProcessor");
const { logStep } = require("../utils/workflowLogger");

async function runProductWorkflow(input) {
  try {
    const plan = {
      steps: [
        "Get product information",
        "Prepare relevant context",
        "Generate product description",
        "Process AI output",
        "Validate generated description",
      ],
    };

    logStep("1. PLANNER", "Workflow plan created", plan);

    const product = getProductInfo(input.name.trim());

    if (!product) {
      logStep("2. PRODUCT RETRIEVAL", "Product not found", input.name);

      return {
        success: false,
        message: "Product not found.",
      };
    }

    logStep("2. PRODUCT RETRIEVAL", "Product retrieved successfully", product);

    const context = {
      name: product.name,
      material: product.material,
      color: product.color,
      category: product.category,
    };

    logStep("3. CONTEXT OPTIMIZATION", "Relevant context prepared", context);

    let rawDescription;

    try {
      rawDescription = await generateDescription(context);

      logStep("4. AI EXECUTION", "AI generation completed", rawDescription);
    } catch (error) {
      logStep("4. AI EXECUTION", "AI generation failed", error.message);

      return {
        success: false,
        message: "AI generation failed.",
      };
    }

    const description = processOutput(rawDescription);

    logStep("5. OUTPUT PROCESSING", "AI output processed", description);

    const validationResult = validateDescription(description, product);

    logStep(
      "6. VALIDATION",
      validationResult.isValid ? "Validation passed" : "Validation failed",
      validationResult.validation,
    );

    if (!validationResult.isValid) {
      logStep("7. FALLBACK", "Using fallback description");

      const fallbackDescription = `
Introducing the ${product.name}, a refined addition to the Émera collection.
Crafted in ${product.material} and presented in ${product.color}, this
${product.category} combines timeless elegance with sophisticated everyday style.
Designed for those who appreciate understated luxury, the ${product.name}
offers a polished presence suitable for a variety of occasions.
Its refined character reflects the modern and confident spirit of Émera,
while its versatile design makes it an elegant choice for everyday use.
This piece brings a graceful finishing touch to your collection without
compromising its sophisticated and timeless appeal.
`;

      const processedFallback = processOutput(fallbackDescription);

      return {
        success: true,
        product,
        description: processedFallback,
        workflow: {
          planned: true,
          toolUsed: true,
          contextOptimized: true,
          executed: true,
          outputProcessed: true,
          validated: false,
          fallbackUsed: true,
        },
      };
    }

    logStep("8. FINAL", "Workflow completed successfully");

    return {
      success: true,
      product,
      description,
      workflow: {
        planned: true,
        toolUsed: true,
        contextOptimized: true,
        executed: true,
        outputProcessed: true,
        validated: true,
        fallbackUsed: false,
      },
    };
  } catch (error) {
    logStep("WORKFLOW ERROR", "Unexpected workflow failure", error.message);

    return {
      success: false,
      message: error.message || "Workflow processing failed.",
    };
  }
}

module.exports = {
  runProductWorkflow,
};
