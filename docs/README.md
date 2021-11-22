multi-chain-balances-ts / [Exports](modules.md)

# multi-chain-balances-ts

> Get all token/vault data, readable transactions w/ prices, and Beefy.Finance Vault info on Ethereum, BSC, Polygon, Avalanche, Fantom, Cronos, and Moonriver Blockchains.

## Install

```bash
$ npm i -S multi-chain-balances-ts
```

## Usage

```javascript
const info = new MultiChain()
await info.getBalances()
await info.getTransactions()
```

## Documentation

- [Package Docs](docs/globals.md)
