require("dotenv").config();

const { runProductWorkflow } = require("../workflows/productWorkflow");
const { validateDescription } = require("../services/validator");

async function runEvaluation() {
  const testCases = [
    {
      name: "Valid product",
      input: {
        name: "Emerald Mini Bag",
      },
      expectedSuccess: true,
    },

    {
      name: "Another valid product",
      input: {
        name: "Zouk Laptop Bag",
      },
      expectedSuccess: true,
    },

    {
      name: "Unknown product",
      input: {
        name: "Unknown Bag",
      },
      expectedSuccess: false,
    },

    {
      name: "Empty product name",
      input: {
        name: "",
      },
      expectedSuccess: false,
    },
  ];

  let passed = 0;


  for (const test of testCases) {
    console.log(`\nRunning: ${test.name}`);

    try {
      const result = await runProductWorkflow(test.input);

      let passedTest =
        result.success === test.expectedSuccess;

      if (test.expectedSuccess && result.success) {
        const description = result.description.toLowerCase();

        const product = result.product;

        const wordCount = description
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;

        const qualityChecks = {
          hasDescription: description.length > 0,

          containsName: description.includes(
            product.name.toLowerCase()
          ),

          containsMaterial: description.includes(
            product.material.toLowerCase()
          ),

          containsColor: description.includes(
            product.color.toLowerCase()
          ),

          containsCategory: description.includes(
            product.category.toLowerCase()
          ),

          wordCountValid:
            wordCount >= 80 && wordCount <= 100,
        };

        console.log(
          "QUALITY CHECKS:",
          qualityChecks
        );

        const qualityPassed =
          Object.values(qualityChecks).every(Boolean);

        passedTest = passedTest && qualityPassed;
      }

      if (passedTest) {
        console.log("✅ PASS");
        passed++;
      } else {
        console.log("❌ FAIL");
      }
    } catch (error) {
      console.log("❌ ERROR:", error.message);
    }
  }


  console.log("\nRunning: Hallucination detection test");

  const testProduct = {
    name: "Emerald Mini Bag",
    material: "Leather",
    color: "Emerald Green",
    category: "Mini Bag",
  };

  const fakeDescription = `
Introducing the Emerald Mini Bag, a luxurious addition to the Émera collection.
Crafted from Leather and presented in Emerald Green, this Mini Bag offers
a refined and sophisticated style for modern fashion lovers. The bag is
waterproof and handmade in Italy using premium materials. Its elegant design
provides a polished appearance suitable for everyday occasions and special events.
The Emerald Mini Bag combines timeless elegance with a confident luxury aesthetic
while offering exceptional quality and distinctive character for every wardrobe.
`;

  const hallucinationResult = validateDescription(
    fakeDescription,
    testProduct
  );

  console.log(
    "HALLUCINATION VALIDATION:",
    hallucinationResult.validation
  );

  if (
    hallucinationResult.isValid === false &&
    hallucinationResult.validation.noUnsupportedClaims === false
  ) {
    console.log("✅ HALLUCINATION TEST PASSED");
    passed++;
  } else {
    console.log("❌ HALLUCINATION TEST FAILED");
  }


  const totalTests = testCases.length + 1;

  console.log("\n==============================");
  console.log(
    `Evaluation: ${passed}/${totalTests} tests passed`
  );
  console.log("==============================");
}

runEvaluation();