[multi-chain-balances-ts](../README.md) / [Exports](../modules.md) / default

# Class: default

DefiTransactions Class

## Hierarchy

- `DefiBalances`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [address](default.md#address)
- [assets](default.md#assets)
- [chainNames](default.md#chainnames)
- [chains](default.md#chains)
- [tokenNames](default.md#tokennames)
- [totalTokenValue](default.md#totaltokenvalue)
- [totalValue](default.md#totalvalue)
- [totalVaultValue](default.md#totalvaultvalue)
- [transactions](default.md#transactions)

### Methods

- [getApeBoardEndpoint](default.md#getapeboardendpoint)
- [getBalances](default.md#getbalances)
- [getDefiTaxesEndpoint](default.md#getdefitaxesendpoint)
- [getEndpoint](default.md#getendpoint)
- [getTransactions](default.md#gettransactions)

## Constructors

### constructor

• **new default**()

Constructor

#### Inherited from

DefiBalances.constructor

#### Defined in

[utils/DefiBalances.ts:50](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L50)

## Properties

### address

• **address**: `string`

#### Inherited from

DefiBalances.address

#### Defined in

[utils/DefiBalances.ts:37](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L37)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiBalances.assets

#### Defined in

[utils/DefiBalances.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L42)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiBalances.chainNames

#### Defined in

[utils/DefiBalances.ts:43](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L43)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiBalances.chains

#### Defined in

[utils/DefiBalances.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L41)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiBalances.tokenNames

#### Defined in

[utils/DefiBalances.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L44)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiBalances.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:39](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L39)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiBalances.totalValue

#### Defined in

[utils/DefiBalances.ts:38](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L38)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiBalances.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L40)

___

### transactions

• **transactions**: `Transactions`

#### Defined in

[utils/DefiTransactions.ts:33](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiTransactions.ts#L33)

## Methods

### getApeBoardEndpoint

▸ **getApeBoardEndpoint**(`endpoint`): `Promise`<`any`\>

Get Ape Board Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` \| ``"transactionHistoryBsc"`` \| ``"transactionHistoryEth"`` \| ``"transactionHistoryMatic"`` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiBalances.getApeBoardEndpoint

#### Defined in

[utils/DefiBalances.ts:487](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L487)

___

### getBalances

▸ **getBalances**(): `Promise`<`void`\>

Get All Balances

#### Returns

`Promise`<`void`\>

#### Inherited from

DefiBalances.getBalances

#### Defined in

[utils/DefiBalances.ts:58](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L58)

___

### getDefiTaxesEndpoint

▸ `Private` **getDefiTaxesEndpoint**(`endpoint`, `args`): `Promise`<`any`\>

Get Defi Taxes Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` \| ``"transactionHistoryBsc"`` \| ``"transactionHistoryEth"`` \| ``"transactionHistoryMatic"`` |
| `args` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/DefiTransactions.ts:367](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiTransactions.ts#L367)

___

### getEndpoint

▸ **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"debank"`` \| ``"beefy"`` \| ``"apeBoard"`` \| ``"defiTaxes"`` |
| `endpoint` | ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` \| ``"transactionHistoryBsc"`` \| ``"transactionHistoryEth"`` \| ``"transactionHistoryMatic"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiBalances.getEndpoint

#### Defined in

[utils/DefiBalances.ts:446](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiBalances.ts#L446)

___

### getTransactions

▸ **getTransactions**(): `Promise`<`void`\>

Get Transactions

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiTransactions.ts:39](https://github.com/edmundpf/multi-chain-balances-ts/blob/42d5436/src/utils/DefiTransactions.ts#L39)
