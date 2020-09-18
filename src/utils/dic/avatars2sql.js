const avatars = require('./avatars.json')
const fs= require('fs')

let text=''
for(let eachUrl of avatars){
  text+= `insert into avatars (url) values ('${eachUrl}');\n`
}

fs.writeFileSync(__dirname+'/avatars.sql', text, {
  encoding: 'utf8'
})

