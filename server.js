/* jshint esversion: 6*/
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

function htmlFileGen (name, symbol, number, description, response){
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
    response.end();
  });
}

function indexAppend (file, response){
  fs.readFile('./public/index.html', (err, data) => {
    if (err) throw err;
    let indexString = data.toString();
    let indexArray = indexString.split('\n');
    indexArray.splice(indexArray.length-4, 0, file);
    let joinedArray = indexArray.join('\n');
    fs.writeFile('./public/index.html', joinedArray, (err, data) => {
      if (err) throw err;
      console.log('great job again!\n');
      response.end();
    });

  });
}

function getResponseGen (file, response) {
  let uri;
  if (file === '/'){
    uri = 'index.html';
  }else{
    uri = `${file}.html`;
  }
  fs.readFile(`./public/${uri}`, (err,data) => {
    if (err) throw err;
    let parsedData = data.toString();
    response.write(parsedData);
    response.end();
  });
}

let dataChunk = [];

const server = http.createServer((request, response)=> {
  request.on('data', (chunk) => {
    dataChunk.push(chunk);
  }).on('end', () => {

    let method = request.method;
    let requestPath = request.url;
    let requestChunk = dataChunk.toString();
    let requestForm = querystring.parse(requestChunk);
    let elementName = requestForm.elementName;
    let elementSymbol = requestForm.elementSymbol;
    let atomicNumber = requestForm.atomicNumber;
    let elementDescription = requestForm.elementDescription;


    if (method === 'POST'){
      let elementIndex = `    <li>
      <a href='/${elementName.toLowerCase()}.html'>${elementName}</a>
      </li>`;
      fs.open(`./public/${elementName.toLowerCase()}.html`, 'wx+', (err, fd) => {
        if (err) throw err;
        htmlFileGen(elementName, elementSymbol, atomicNumber, elementDescription, response);
        indexAppend(elementIndex, response);
      });
    }

    if (method === 'GET'){
      getResponseGen(`${requestPath}`, response);
    }

  });
});
server.listen(8080, '0.0.0.0', () => {
  process.stdout.write('listening to port 8080\n');
});
