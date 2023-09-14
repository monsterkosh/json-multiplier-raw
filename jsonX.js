const fs = require('fs');

async function showHelp() {
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
    console.log(`Error: cannot read file "${file}" or file does not exist`);
    return;
  }

  if (Number.isNaN(multiplier)) {
    console.log('\nMissing multiplier');
    return;
  }

  const data = JSON.parse(json);
  const indexValue = '000000000000000000000000';

  const result = [];

  for (let i = 0; i < multiplier; i++) {
    const duplicate = JSON.parse(JSON.stringify(data));

    if (indexName) {
      duplicate[indexName] = indexValue + i;
    } else {
      duplicate._id = { $oid: indexValue + i };
    }

    result.push(duplicate);
  }

  const ogFileName = file.toString().slice(0, -5);
  const resultFileName = `jsonX-${ogFileName}-${multiplier}.json`;

  try {
    fs.writeFileSync(resultFileName, JSON.stringify(result, null, 2));
    console.log(
      `JSON file "${ogFileName}" was multiplied by ${multiplier} using ${indexName ?? '_id'
      } as index`
    );
    console.log(`Results saved under the name "${resultFileName}" `);
  } catch (error) {
    console.log(`There was an error saving results`);
  }
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