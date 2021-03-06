const fs = require('fs')
const exec = require('child_process').exec

const fileName = 'AUTHORS.md'
const exclude = ['.local', 'ti10mylove@163.com', 'Yibang Yang', '立', 'jumore.com'].join('|')
const reg = new RegExp('(' + exclude + ')')

exec('git log --reverse --format="- %aN <%aE>"', {async: true}, (code, stdout, stderr) => {
  if (stderr) throw stderr

  const set = new Set(stdout.split('\n'))
  const authors = [...set].filter((val) => !reg.test(val) && val)

  const fileContent = `# Authors

#### Ordered by first contribution.

${authors.join('\n')}

#### Generated by build/authors.js.`

  fs.open(fileName, 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        fs.writeFile(fileName, fileContent, (e) => {
          if (e) throw e
          console.log(`${fileName} already up-to-date`)
        })
        return
      }
      throw err
    }

    fs.write(fd, fileContent, 0, 'utf8', (e) => {
      if (e) throw e
      fs.closeSync(fd)
      console.log(`${fileName} already created`)
    })
  })
})