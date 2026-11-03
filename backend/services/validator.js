function validateDescription(description, product) {
  const normalizedDescription =
    typeof description === "string"
      ? description.toLowerCase()
      : "";

  const wordCount = normalizedDescription
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

  const hasUnsupportedClaims =
    normalizedDescription.includes("waterproof") ||
    normalizedDescription.includes("genuine") ||
    normalizedDescription.includes("italian") ||
    normalizedDescription.includes("handmade") ||
    normalizedDescription.includes("24k gold") ||
    normalizedDescription.includes("one-of-a-kind");

  const validation = {
    isString: typeof description === "string",

    containsName: normalizedDescription.includes(
      product.name.toLowerCase()
    ),

    containsMaterial: normalizedDescription.includes(
      product.material.toLowerCase()
    ),

    containsColor: normalizedDescription.includes(
      product.color.toLowerCase()
    ),

    containsCategory: normalizedDescription.includes(
      product.category.toLowerCase()
    ),

    wordCountValid: wordCount >= 80 && wordCount <= 100,

    noUnsupportedClaims: !hasUnsupportedClaims,
  };

  const isValid = Object.values(validation).every(Boolean);

  return {
    isValid,
    validation,
    wordCount,
  };
}

module.exports = {
  validateDescription,
};