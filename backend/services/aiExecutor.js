async function generateDescription(product) {
  const prompt = `
You are Émera's luxury ecommerce copywriter.

Generate an 80-100 word product description using ONLY the trusted context below.

TRUSTED CONTEXT:
Product: ${product.name}
Material: ${product.material}
Color: ${product.color}
Category: ${product.category}

RULES:
- Do not invent facts, features, specifications, measurements, materials, benefits, or certifications.
- Use only the provided product information for factual claims.
- General style words such as elegant, refined, sophisticated, timeless, and luxurious are allowed.
- Include the product name, material, color, and category.
- Return only the description.
`;

  if (process.env.USE_MOCK_AI === "true") {
    console.log("MOCK AI MODE");

    return `
Introducing the ${product.name}, a refined addition to the Émera collection.
Crafted in ${product.material} and presented in ${product.color}, this
${product.category} brings together timeless elegance and sophisticated everyday style.
Designed for those who appreciate understated luxury, the ${product.name}
offers a polished presence that complements a variety of occasions.
Its elegant character reflects the modern, confident, and refined spirit of Émera,
making it a graceful choice for those who value effortless sophistication.
Created with a focus on versatile style, this piece can effortlessly complement
both everyday looks and more elevated ensembles while maintaining a distinctive luxury appeal.
`.trim();
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Gemini attempt ${attempt}...`);

        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        console.log("Gemini response received.");

        break;
      } catch (error) {
        console.error(
          `Gemini attempt ${attempt} failed:`,
          error.message
        );

        if (attempt === 3) {
          console.log(
            "Gemini unavailable after 3 attempts. Using fallback."
          );

          return `
Introducing the ${product.name}, a refined addition to the Émera collection.
Crafted in ${product.material} and presented in ${product.color}, this
${product.category} combines timeless elegance with sophisticated everyday style.
Its polished character reflects the modern and confident spirit of Émera.
`.trim();
        }

        const delay = 1000 * Math.pow(2, attempt - 1);

        console.log(
          `Retrying in ${delay / 1000} seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }

    if (!response || !response.text) {
      console.log(
        "Gemini returned an empty response. Using fallback."
      );

      return `
Introducing the ${product.name}, a refined addition to the Émera collection.
Crafted in ${product.material} and presented in ${product.color}, this
${product.category} combines timeless elegance and sophisticated everyday style.
`.trim();
    }

    return response.text;
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================");

    return `
Introducing the ${product.name}, a refined addition to the Émera collection.
Crafted in ${product.material} and presented in ${product.color}, this
${product.category} combines timeless elegance and sophisticated everyday style.
Its polished character reflects the modern and confident spirit of Émera.
`.trim();
  }
}

module.exports = {
  generateDescription,
};