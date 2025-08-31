const fs = require("fs");
const sharp = require("sharp");

const inputDirs = [
  "./ui-src/textures",
  "./ui-src/textures/environment",
];

for (const inputDir of inputDirs) {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    if (!/-bump\.webp$/i.test(file)) continue; // only process bump maps

    const inputPath = `${inputDir}/${file}`;
    const outputPath = `${inputDir}/1x-${file}`; // overwrite in place

    sharp(inputPath)
      .resize(1024, 512, { fit: "fill" }) // force exact 1024x512
      .toFile(outputPath)
      .then(() => console.log(`✅ Resized: ${file} → 1024x512`))
      .catch(err => console.error(`❌ Error resizing ${file}:`, err));
  }
}