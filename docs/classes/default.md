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

- [getApeBoardPositions](default.md#getapeboardpositions)
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

[utils/DefiBalances.ts:53](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L53)

## Properties

### address

• **address**: `string`

#### Inherited from

DefiBalances.address

#### Defined in

[utils/DefiBalances.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L40)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiBalances.assets

#### Defined in

[utils/DefiBalances.ts:45](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L45)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiBalances.chainNames

#### Defined in

[utils/DefiBalances.ts:46](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L46)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiBalances.chains

#### Defined in

[utils/DefiBalances.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L44)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiBalances.tokenNames

#### Defined in

[utils/DefiBalances.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L47)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiBalances.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L42)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiBalances.totalValue

#### Defined in

[utils/DefiBalances.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L41)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiBalances.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:43](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L43)

___

### transactions

• **transactions**: `Transactions`

#### Defined in

[utils/DefiTransactions.ts:25](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiTransactions.ts#L25)

## Methods

### getApeBoardPositions

▸ **getApeBoardPositions**(): `Promise`<`ApeBoardPositions`\>

Get Ape Board Positions

#### Returns

`Promise`<`ApeBoardPositions`\>

#### Inherited from

DefiBalances.getApeBoardPositions

#### Defined in

[utils/DefiBalances.ts:457](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L457)

___

### getBalances

▸ **getBalances**(): `Promise`<`void`\>

Get All Balances

#### Returns

`Promise`<`void`\>

#### Inherited from

DefiBalances.getBalances

#### Defined in

[utils/DefiBalances.ts:61](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L61)

___

### getDefiTaxesEndpoint

▸ `Private` **getDefiTaxesEndpoint**(`endpoint`, `args`): `Promise`<`any`\>

Get Defi Taxes Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |
| `args` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/DefiTransactions.ts:277](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiTransactions.ts#L277)

___

### getEndpoint

▸ **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"debank"`` \| ``"beefy"`` \| ``"apeBoard"`` \| ``"defiTaxes"`` |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiBalances.getEndpoint

#### Defined in

[utils/DefiBalances.ts:508](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiBalances.ts#L508)

___

### getTransactions

▸ **getTransactions**(`useReq?`): `Promise`<`void`\>

Get Transactions

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `useReq` | `boolean` | `true` |

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiTransactions.ts:31](https://github.com/edmundpf/multi-chain-balances-ts/blob/26932dc/src/utils/DefiTransactions.ts#L31)
