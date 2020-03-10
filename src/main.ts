const Web3 = require('web3');
var fs = require('fs');
const fastcsv = require('fast-csv');

async function main(outputFile: string) {
  let contract_artifact = fs.readFileSync('OceanToken.json');
  contract_artifact = JSON.parse(contract_artifact);
  let provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/41f6b8b3d74a4d3fb775a0efe458e2c9');
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contract_artifact.abi, contract_artifact.address);
  const _filter = {from: ['0x2B5634C42055806a59e9107ED44D43c426E58258'], to: ['0xC4B2F04E4460D072536ED900B28C06C0a79Fe774'] };

  let events = await contract.getPastEvents('Transfer',
  {
      filter: _filter,
      fromBlock: 9634793,
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

main('out.scv');