'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const data = [];
async function processLineByLine() {
  const fileStream = fs.createReadStream(path.resolve(__dirname, './poi.txt'));

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    console.log(line);

    data.push(line.split(' ')[0]);
  }
  console.log('处理结果', data);
  fs.writeFileSync(path.resolve(__dirname, './output.txt'), JSON.stringify(data));
}

processLineByLine()
;
