// utility to convert textures to webp
const fs = require("fs");
const sharp = require("sharp");

const inputDirs = [
  "./ui-src/textures",
  "./ui-src/textures/environment",
];

for (const inputDir of inputDirs) {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;

    const inputPath = `${inputDir}/${file}`;
    const outputPath = `${inputDir}/${file.replace(/\.(jpg|jpeg|png)$/i, ".webp")}`;

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`✅ Converted: ${file} → ${outputPath}`))
      .catch(err => console.error(`❌ Error converting ${file}:`, err));
  }
}