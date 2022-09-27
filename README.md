# multi-chain-balances-ts

> Get all token/vault balances, readable transactions w/ prices, and Beefy.Finance vault info on EVM blockchains using Debank/Beefy data.

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
