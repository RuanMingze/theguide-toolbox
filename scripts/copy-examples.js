const fs = require('fs')
const path = require('path')

const examplesDir = path.join(__dirname, '..', 'examples')
const publicExamplesDir = path.join(__dirname, '..', 'public', 'examples')

// 确保 public/examples 目录存在
if (!fs.existsSync(publicExamplesDir)) {
  fs.mkdirSync(publicExamplesDir, { recursive: true })
  console.log('Created public/examples directory')
}

// 复制所有 ZIP 文件
const zipFiles = fs.readdirSync(examplesDir).filter(file => file.endsWith('.zip'))

for (const file of zipFiles) {
  const srcPath = path.join(examplesDir, file)
  const destPath = path.join(publicExamplesDir, file)
  
  // 只复制文件，不复制目录
  const stat = fs.statSync(srcPath)
  if (stat.isFile()) {
    fs.copyFileSync(srcPath, destPath)
    console.log(`Copied ${file} to public/examples/`)
  }
}

console.log('Examples copy completed')
