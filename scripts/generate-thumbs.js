import fs from "fs"
import path from "path"
import sharp from "sharp"

const inputDir = "public/images/fulls"
const outputDir = "public/images/thumbs"

fs.mkdirSync(outputDir, { recursive: true })

fs.readdirSync(inputDir).forEach(file => {
  if (!file.match(/\.(jpg|jpeg|png)$/i)) return
  const inputPath = path.join(inputDir, file)
  const outputPath = path.join(outputDir, file)

  sharp(inputPath)
    .resize(200) // width = 200px
    .toFile(outputPath)
    .then(() => console.log(`✅ Created thumbnail: ${outputPath}`))
})
