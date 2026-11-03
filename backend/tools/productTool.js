const products = {
  "zouk laptop bag": {
    name: "Zouk Laptop Bag",
    material: "Leather",
    color: "Emerald Green",
    category: "Mini Bag",
    stock: 12,
  },

  "emerald mini bag": {
    name: "Emerald Mini Bag",
    material: "Leather",
    color: "Emerald Green",
    category: "Mini Bag",
    stock: 8,
  },
};

function getProductInfo(productName) {
  const key = productName.trim().toLowerCase();

  return products[key] || null;
}

module.exports = {
  getProductInfo,
};