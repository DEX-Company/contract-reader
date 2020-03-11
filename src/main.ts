const Web3 = require('web3');
var fs = require('fs');
const fastcsv = require('fast-csv');

async function main(inputFile: string, outputFile: string, fromBlock: number, address: string, filter: any) {
  let contract_ABI = fs.readFileSync(inputFile);
  contract_ABI = JSON.parse(contract_ABI);
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

const filter = {from: ['0x2B5634C42055806a59e9107ED44D43c426E58258'], to: ['0xC4B2F04E4460D072536ED900B28C06C0a79Fe774'] };

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

main('OceanToken.json', 'out.scv', 9634793, '0x985dd3D42De1e256d09e1c10F112bCCB8015AD41', filter);