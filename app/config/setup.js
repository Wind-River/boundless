let fs = require('fs')

let path = process.cwd()

let buffer = fs.readFileSync(`${path}/config/system.yml`)

let docData = buffer.toString().split('\r\n')

// somewhat of a hard code
let finalStr = 'export const databaseConfig = {\n'
let onDev = false

for (let i in docData) {
  let line = docData[i]

  let lineComp = line.split('  ')
  if (lineComp.length === 2) {
    if (docData.length < 25 && lineComp[1] === 'dev:') {
      finalStr += `  ${lineComp[1]} {}\n`
    } else {
      finalStr += `  ${lineComp[1]} {\n`
      onDev = lineComp[1] === 'dev:'
    }
  } else if (lineComp.length === 3) {
    let value = lineComp[2].split(' ')
    value[1] = value[1].replace(/\"/g, '')
    value[1] = value[1].replace(/\'/g, '')
    if (value[0] === 'appId:') {
      if (onDev) {
        finalStr += `    ${value[0]} \'${value[1]}\'\n  }\n`
      } else {
        finalStr += `    ${value[0]} \'${value[1]}\'\n  },\n`
      }
    } else {
      finalStr += `    ${value[0]} \'${value[1]}\',\n`
    }
  }
}

finalStr = finalStr + '}\n'

fs.writeFile('config/system.js', finalStr, function (err) {
  if (err) 
    return console.log(err)
  console.log(`'system.js' file has been created from 'system.yml' file...`)
})
