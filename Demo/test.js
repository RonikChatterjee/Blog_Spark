import fs from 'fs'
// console.log(fs.readdirSync('./uploads'))

fs.readdirSync('./uploads').forEach(file => {
  const filePath = `./uploads/${file}`
  console.log(fs.statSync(filePath))
  console.log('isFile', fs.statSync(filePath).isFile())
  fs.rmSync(filePath)
})
