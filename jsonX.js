const fs = require('fs');

function showHelp() {
  console.log(`Grab a JSON file with only 1 object inside, and put this file inside the repository folder.
  Type in terminal $ node jsonX.js --run  with the following arguments:
  
      ።  file               *string
      ።  multiplier         *number
    
      Optional (default is "_id"):
      ።  index              *string
  
    example:  $ node jsonX.js --run myFile.json 500 user_id 
    `);
}

function runJsonX(file, multiplier, indexName) {
  if (!file || file === 'undefined') {
    console.log(`Missing fileName`);
    return;
  }

  let json;

  try {
    console.log({ file });
    json = fs.readFileSync(`./${file}`, {
      encoding: 'utf8',
      flag: 'r',
    });
  } catch {
    console.log(`Error: cannot read file "${file}" or file does not exists`);
    return;
  }

  if (Number.isNaN(multiplier)) {
    console.log('\nMissing multiplier');
    return;
  }

  const data = JSON.parse(json);
  const result = [];
  const indexValue = '000000000000000000000000';

  if (indexName) {
    indexName = String(indexName);
    for (let i = 0; i < multiplier; i++) {
      const element = Object.assign({}, data[0]);
      element[indexName] = indexValue + i;

      result.push(element);
    }
  } else {
    for (let i = 0; i < multiplier; i++) {
      const element = Object.assign({}, data[0]);
      element._id = { $oid: indexValue + i };

      result.push(element);
    }
  }

  const jsonResult = JSON.stringify(result);
  const ogFileName = file.toString().slice(0, -5);
  const resultFileName = `jsonX-${ogFileName}-${multiplier}.json`;

  try {
    fs.writeFileSync(resultFileName, jsonResult);
  } catch (error) {
    console.log(`There was a error saving results`);
  }

  console.log(
    `JSON file "${ogFileName}" was multiplied by ${multiplier} using ${
      indexName ?? '_id'
    } as index`
  );

  console.log(`Results saved under the name "${resultFileName}" `);
}

(function main() {
  console.log(`
 ┏┳┏┓┏┓┳┓  ┳┳┓┳┳┓ ┏┳┓┳┏┓┓ ┳┏┓┳┓
  ┃┗┓┃┃┃┃  ┃┃┃┃┃┃  ┃ ┃┃┃┃ ┃┣ ┣┫
 ┗┛┗┛┗┛┛┗  ┛ ┗┗┛┗┛ ┻ ┻┣┛┗┛┻┗┛┛┗
  `);

  const option = String(process.argv[2]);
  const file = String(process.argv[3]);
  const multiplier = Number(process.argv[4]);
  let indexName = String(process.argv[5]);

  if (option === '--help') {
    showHelp();
    return;
  }

  if (option === '--run') {
    runJsonX(file, multiplier, indexName);
    return;
  }

  console.log('\nUse --help to see how to use JSON.Multiplier');
  return;
})();
