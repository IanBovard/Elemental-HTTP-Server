/* jshint esversion: 6*/
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

function htmlFileGen (name, symbol, number, description){
  let fileName = `public/${name}.html`;
  let htmlString  = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>The Elements - ${name}</title>
  <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
  <h1>${name}</h1>
  <h2>${symbol}</h2>
  <h3>Atomic number ${number}</h3>
  <p>${description}</p>
  <p><a href="/">back</a></p>
  </body>
  </html>`;
  fs.writeFile(fileName.toLowerCase(), htmlString, (err,data) => {
    if (err) throw err;
    process.stdout.write('great job!\n');
  });
}

function indexAppend (newlink){
  fs.readFile('./public/index.html', (err, data) => {
    let indexString = data.toString();
    let indexArray = indexString.split('\n');
    indexArray.splice(indexArray.length-3, 0, newlink);
    fs.writeFile('./public/index.html', indexArray.join('\n'), (err, data) => {
      if (err) throw err;
      console.log('great job again!\n');
    });

  });
}

let dataChunk = [];

const server = http.createServer((request, response)=> {
  request.on('data', (chunk) => {
    dataChunk.push(chunk);
  }).on('end', () => {
    let method = request.method;
    let requestChunk = dataChunk.toString();
    let requestForm = querystring.parse(requestChunk);
    let elementName = requestForm.elementName;
    let elementSymbol = requestForm.elementSymbol;
    let atomicNumber = requestForm.atomicNumber;
    let elementDescription = requestForm.elementDescription;
    let elementIndex = `    <li>
    <a href="/${elementName.toLowerCase()}.html">${elementName}</a>
    </li>`;


    if (method === 'POST'){
      fs.open('./public/index.html', 'wx+', (err, fd) => {
        htmlFileGen(elementName, elementSymbol, atomicNumber, elementDescription);
        indexAppend(elementIndex);
      });
    }

  });
});
server.listen(8080, '0.0.0.0', () => {
  process.stdout.write('listening to port 8080\n');
});
