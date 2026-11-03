function logStep(step, message, data = null) {
  console.log(`\n========== ${step} ==========`);

  console.log(message);

  if (data !== null) {
    console.log(data);
  }

  console.log("================================");
}

module.exports = {
  logStep,
};