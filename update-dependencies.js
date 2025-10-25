const fs = require("fs");
const path = require("path");

// Read the current package.json
const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = require(packageJsonPath);

// Add new dependencies
packageJson.dependencies = {
  ...packageJson.dependencies,
  tailwindcss: "^3.3.3",
  daisyui: "^3.7.3",
  "@tailwindcss/typography": "^0.5.9",
  postcss: "^8.4.29",
  autoprefixer: "^10.4.15",
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
