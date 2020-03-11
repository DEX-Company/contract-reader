const Web3 = require('web3');
var fs = require('fs');
const fastcsv = require('fast-csv');

function getABI(inputFile: string) {
  let contract_ABI = fs.readFileSync(inputFile);
  return JSON.parse(contract_ABI);
}

async function main(contract_ABI: any, outputFile: string, fromBlock: number, address: string, filter: any) {
  let provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/41f6b8b3d74a4d3fb775a0efe458e2c9');
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contract_ABI, address);

  let events = await contract.getPastEvents('Transfer',
  {
      filter: filter,
      fromBlock: fromBlock,
      toBlock: "latest"
  });

  let data = [];
  events.forEach(function (element) {
    data.push({
      from: element.returnValues.from,
      to: element.returnValues.to,
      value: element.returnValues.value
    });
  });
  const ws = fs.createWriteStream(outputFile);
  fastcsv.write(data, { headers: true }).pipe(ws);
}

function buildFilter(args: any, contract_ABI: any, event_name: string) {
  let saved_element;
  contract_ABI.forEach(function (element) {
    if(element['name'] === event_name && element['type'] === 'event') {
      saved_element = element;
    }
  });
  let filter = {}
  Object.keys(args).forEach(function(key) {
    if(key == '_'){
      return;
    }
    saved_element['inputs'].forEach(function (input) {
      if(input['name'] === key && input['indexed']) {
        filter[key] = [args[key]];
      }
    });
  });
  return filter;
}

const args = require('yargs').argv;
const abi = getABI(args['_'][0]);
const filter = buildFilter(args, abi, args['_'][2]);
console.log(filter);
console.log(args['_']);
main(abi, args['_'][4], args['_'][3], args['_'][1], filter);