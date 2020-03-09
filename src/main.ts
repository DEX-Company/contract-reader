const Web3 = require('web3');
var fs = require('fs');

async function main() {
  let contract_artifact = fs.readFileSync('OceanToken.json');
  contract_artifact = JSON.parse(contract_artifact);
  let provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/41f6b8b3d74a4d3fb775a0efe458e2c9');
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(contract_artifact.abi, contract_artifact.address);
}

main();