# Contract Reader
Docker container which can be used for reading and accumulating statistics from any event of any smart contract in Mainnet.
## Command line to run
```
node dist/main.js <ABI File> <Contract Address> <Event Name> <Block Starting From> <Output CSV File> <Filters. Optional>
```
ABI File - should be placed in the same folder.

Block Starting From - can be set to 0 but most likely this operation will be reverted by the network since it has timeout restriction.

Output CSV File - the structure of this table is based on ABI of Event.

Filters have the following format --filter_name filter_value.
Filtering is done accodring to ABI of the Event and is possible only by __indexed__ fields
## Example of Usage
```
node dist/main.js OceanToken.json 0x985dd3D42De1e256d09e1c10F112bCCB8015AD41 Transfer 9634793 out.csv --from 0x2B5634C42055806a59e9107ED44D43c426E58258 --to 0xC4B2F04E4460D072536ED900B28C06C0a79Fe774
```
It will create file out.csv with all transaction with Transfer event of OceanToken with address 0x985dd3D42De1e256d09e1c10F112bCCB8015AD41 in Mainnet starting from block 9634793 and filtered by sender=0x2B5634C42055806a59e9107ED44D43c426E58258 and receiver=0xC4B2F04E4460D072536ED900B28C06C0a79Fe774
