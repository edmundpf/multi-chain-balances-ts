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

### Methods

- [getApeBoardEndpoint](default.md#getapeboardendpoint)
- [getBalances](default.md#getbalances)
- [getEndpoint](default.md#getendpoint)
- [getPrivateDebankEndpoint](default.md#getprivatedebankendpoint)
- [getTokenAddresses](default.md#gettokenaddresses)
- [getTokenName](default.md#gettokenname)
- [getTransactions](default.md#gettransactions)
- [isContract](default.md#iscontract)
- [splitHistoryRecord](default.md#splithistoryrecord)
- [sterilizeApeBoardTransfer](default.md#sterilizeapeboardtransfer)
- [sterilizeDebankTransfer](default.md#sterilizedebanktransfer)
- [sterilizeHistoryRecord](default.md#sterilizehistoryrecord)
- [sterilizeTransactionType](default.md#sterilizetransactiontype)

## Constructors

### constructor

• **new default**()

Constructor

#### Inherited from

DefiBalances.constructor

#### Defined in

[utils/DefiBalances.ts:50](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L50)

## Properties

### address

• **address**: `string`

#### Inherited from

DefiBalances.address

#### Defined in

[utils/DefiBalances.ts:37](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L37)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiBalances.assets

#### Defined in

[utils/DefiBalances.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L42)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiBalances.chainNames

#### Defined in

[utils/DefiBalances.ts:43](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L43)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiBalances.chains

#### Defined in

[utils/DefiBalances.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L41)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiBalances.tokenNames

#### Defined in

[utils/DefiBalances.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L44)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiBalances.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:39](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L39)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiBalances.totalValue

#### Defined in

[utils/DefiBalances.ts:38](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L38)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiBalances.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L40)

## Methods

### getApeBoardEndpoint

▸ **getApeBoardEndpoint**(`endpoint`): `Promise`<`any`\>

Get Ape Board Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyApy"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardHistory"`` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiBalances.getApeBoardEndpoint

#### Defined in

[utils/DefiBalances.ts:501](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L501)

___

### getBalances

▸ **getBalances**(): `Promise`<`void`\>

Get All Balances

#### Returns

`Promise`<`void`\>

#### Inherited from

DefiBalances.getBalances

#### Defined in

[utils/DefiBalances.ts:58](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L58)

___

### getEndpoint

▸ **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"debank"`` \| ``"debankPrivate"`` \| ``"beefy"`` \| ``"apeBoard"`` \| ``"defiTaxes"`` |
| `endpoint` | ``"beefyApy"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardHistory"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiBalances.getEndpoint

#### Defined in

[utils/DefiBalances.ts:446](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L446)

___

### getPrivateDebankEndpoint

▸ **getPrivateDebankEndpoint**(`endpoint`, `params?`): `Promise`<`any`\>

Get Private Debank Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyApy"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardHistory"`` |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiBalances.getPrivateDebankEndpoint

#### Defined in

[utils/DefiBalances.ts:487](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiBalances.ts#L487)

___

### getTokenAddresses

▸ `Private` **getTokenAddresses**(`records`, `tokenSymbols`): `Object`

Get Token Addresses

#### Parameters

| Name | Type |
| :------ | :------ |
| `records` | `ApeBoardHistory`[] \| `DebankHistory`[] |
| `tokenSymbols` | `DebankTokens` |

#### Returns

`Object`

#### Defined in

[utils/DefiTransactions.ts:355](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L355)

___

### getTokenName

▸ `Private` **getTokenName**(`symbol`, `address`, `chainName`, `tokenAddresses`): `string`

Get Token Name

#### Parameters

| Name | Type |
| :------ | :------ |
| `symbol` | `string` |
| `address` | `string` |
| `chainName` | keyof `Chains` |
| `tokenAddresses` | `Object` |

#### Returns

`string`

#### Defined in

[utils/DefiTransactions.ts:407](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L407)

___

### getTransactions

▸ **getTransactions**(`useDebank?`): `Promise`<`void`\>

Get Transactions

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `useDebank` | `boolean` | `true` |

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiTransactions.ts:30](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L30)

___

### isContract

▸ `Private` **isContract**(`address`): `boolean`

Is Contract

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/DefiTransactions.ts:533](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L533)

___

### splitHistoryRecord

▸ `Private` **splitHistoryRecord**(`record`): `HistoryRecord`[]

Split History Record

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | `HistoryRecord` |

#### Returns

`HistoryRecord`[]

#### Defined in

[utils/DefiTransactions.ts:242](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L242)

___

### sterilizeApeBoardTransfer

▸ `Private` **sterilizeApeBoardTransfer**(`record`, `chainName`, `tokenAddresses`): `Object`

Sterilize Ape Board Transfer

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | `ApeBoardTransfer` |
| `chainName` | keyof `Chains` |
| `tokenAddresses` | `Object` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `quantity` | `number` |
| `token` | `string` |

#### Defined in

[utils/DefiTransactions.ts:443](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L443)

___

### sterilizeDebankTransfer

▸ `Private` **sterilizeDebankTransfer**(`record`, `chainName`, `isSend?`, `tokenSymbols`, `tokenAddresses`): `Object`

Sterilize Debank Transfer

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `record` | `DebankTransfer` | `undefined` |
| `chainName` | keyof `Chains` | `undefined` |
| `isSend` | `boolean` | `true` |
| `tokenSymbols` | `DebankTokens` | `undefined` |
| `tokenAddresses` | `Object` | `undefined` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `quantity` | `number` |
| `token` | `string` |

#### Defined in

[utils/DefiTransactions.ts:467](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L467)

___

### sterilizeHistoryRecord

▸ `Private` **sterilizeHistoryRecord**(`record`, `chainName`, `tokenSymbols`, `tokenAddresses`): `HistoryRecord`

Sterilize History Record

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | `DebankHistory` \| `ApeBoardHistory` |
| `chainName` | ``"bsc"`` \| ``"eth"`` \| ``"ftm"`` \| ``"matic"`` |
| `tokenSymbols` | `DebankTokens` |
| `tokenAddresses` | `Object` |

#### Returns

`HistoryRecord`

#### Defined in

[utils/DefiTransactions.ts:125](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L125)

___

### sterilizeTransactionType

▸ `Private` **sterilizeTransactionType**(`type`, `tokens`): `string`

Sterilize Transaction Type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `tokens` | `TokenRecords` |

#### Returns

`string`

#### Defined in

[utils/DefiTransactions.ts:492](https://github.com/edmundpf/multi-chain-balances-ts/blob/30c515a/src/utils/DefiTransactions.ts#L492)
