import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Update this path to your SVG folder
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const svgDir = path.resolve(__dirname, '../assets/icons')

fs.readdirSync(svgDir).forEach((file) => {
  if (!file.endsWith('.svg'))
    return

  const filePath = path.join(svgDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  // Remove width and height from <svg>
  content = content.replace(/\s(width|height)="[^"]*"/g, '')

  // Replace or add fill="currentColor" on <svg>
  const svgTagMatch = content.match(/<svg[^>]*>/)
  if (svgTagMatch) {
    const svgTag = svgTagMatch[0]
    const fillMatch = svgTag.match(/fill="([^"]*)"/)

    if (fillMatch) {
      const fillValue = fillMatch[1]
      // Replace fill only if it is NOT "none"
      if (fillValue !== 'none') {
        const newSvgTag = svgTag.replace(/fill="[^"]*"/, 'fill="currentColor"')
        content = content.replace(svgTag, newSvgTag)
      }
    // else do nothing if fill="none"
    }
    else {
    // No fill attribute - add fill="currentColor"
      const newSvgTag = svgTag.replace('<svg', '<svg fill="currentColor"')
      content = content.replace(svgTag, newSvgTag)
    }
  }

  // Replace all fill="#..." or fill="none" in <path>, <circle>, etc. with fill="currentColor"
  content = content.replace(/fill="((#\w{3,6})|(?!none)\w+)"/gi, 'fill="currentColor"')
  content = content.replace(/stroke="((#\w{3,6})|(?!none)\w+)"/gi, 'stroke="currentColor"')

  fs.writeFileSync(filePath, content, 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`✔ Updated ${file}`)
})
