function processOutput(description) {
  if (typeof description !== "string") {
    return "";
  }

  return description
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  processOutput,
};