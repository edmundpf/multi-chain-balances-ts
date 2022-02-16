[multi-chain-balances-ts](../README.md) / [Exports](../modules.md) / default

# Class: default

DefiPrices Class

## Hierarchy

- `DefiTransactions`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [address](default.md#address)
- [assets](default.md#assets)
- [chainNames](default.md#chainnames)
- [chains](default.md#chains)
- [filterUnknownTokens](default.md#filterunknowntokens)
- [isEVM](default.md#isevm)
- [nextApiCallMs](default.md#nextapicallms)
- [recentApiCalls](default.md#recentapicalls)
- [tokenNames](default.md#tokennames)
- [totalTokenValue](default.md#totaltokenvalue)
- [totalValue](default.md#totalvalue)
- [totalVaultValue](default.md#totalvaultvalue)
- [unknownTokens](default.md#unknowntokens)

### Methods

- [addTokenTime](default.md#addtokentime)
- [calculateTotalsWithSlippage](default.md#calculatetotalswithslippage)
- [driver](default.md#driver)
- [getAllDaysOutLists](default.md#getalldaysoutlists)
- [getAllTokenPrices](default.md#getalltokenprices)
- [getBalances](default.md#getbalances)
- [getCoinGeckoEndpoint](default.md#getcoingeckoendpoint)
- [getDaysOutList](default.md#getdaysoutlist)
- [getInsertRecords](default.md#getinsertrecords)
- [getLocalPrices](default.md#getlocalprices)
- [getPriceData](default.md#getpricedata)
- [getSupportedTokens](default.md#getsupportedtokens)
- [getTokenPrices](default.md#gettokenprices)
- [getTokenTransactionTimes](default.md#gettokentransactiontimes)
- [getTransactions](default.md#gettransactions)
- [getUnknownTokens](default.md#getunknowntokens)
- [getValidPriceRecord](default.md#getvalidpricerecord)
- [importPriorTransactions](default.md#importpriortransactions)
- [inferMultiSwap](default.md#infermultiswap)
- [inferSingleSwap](default.md#infersingleswap)
- [inferTransactionPrices](default.md#infertransactionprices)
- [linkLocalPrices](default.md#linklocalprices)
- [linkMergedPrices](default.md#linkmergedprices)
- [manageApiLimits](default.md#manageapilimits)
- [mergeApiAndLocalPrices](default.md#mergeapiandlocalprices)
- [removeGarbagePriceInfo](default.md#removegarbagepriceinfo)
- [setValueAndPrice](default.md#setvalueandprice)
- [syncMissingPrices](default.md#syncmissingprices)
- [updateTransactionData](default.md#updatetransactiondata)

## Constructors

### constructor

• **new default**(`address?`)

Constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |

#### Inherited from

DefiTransactions.constructor

#### Defined in

[utils/DefiBalances.ts:61](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L61)

## Properties

### address

• **address**: `string` = `''`

#### Inherited from

DefiTransactions.address

#### Defined in

[utils/DefiBalances.ts:46](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L46)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiTransactions.assets

#### Defined in

[utils/DefiBalances.ts:52](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L52)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiTransactions.chainNames

#### Defined in

[utils/DefiBalances.ts:53](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L53)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiTransactions.chains

#### Defined in

[utils/DefiBalances.ts:51](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L51)

___

### filterUnknownTokens

• `Private` **filterUnknownTokens**: `boolean` = `false`

#### Defined in

[utils/DefiPrices.ts:48](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L48)

___

### isEVM

• **isEVM**: `boolean` = `false`

#### Inherited from

DefiTransactions.isEVM

#### Defined in

[utils/DefiBalances.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L47)

___

### nextApiCallMs

• `Private` **nextApiCallMs**: `number` = `0`

#### Defined in

[utils/DefiPrices.ts:46](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L46)

___

### recentApiCalls

• `Private` **recentApiCalls**: `number`[] = `[]`

#### Defined in

[utils/DefiPrices.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L47)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiTransactions.tokenNames

#### Defined in

[utils/DefiBalances.ts:54](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L54)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:49](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L49)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalValue

#### Defined in

[utils/DefiBalances.ts:48](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L48)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:50](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L50)

___

### unknownTokens

• **unknownTokens**: `string`[] = `[]`

#### Inherited from

DefiTransactions.unknownTokens

#### Defined in

[utils/DefiBalances.ts:55](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L55)

## Methods

### addTokenTime

▸ `Private` **addTokenTime**(`tokenTimes`, `tokenName`, `time`): `void`

Add Token Time

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenTimes` | `TokenTimes` |
| `tokenName` | `string` |
| `time` | `number` |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:1241](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L1241)

___

### calculateTotalsWithSlippage

▸ `Private` **calculateTotalsWithSlippage**(`absQuoteValueUSD`, `absBaseValueUSD`, `quoteIsStable`, `baseIsStable`): `Object`

Calculate Totals w/ Slippage

#### Parameters

| Name | Type |
| :------ | :------ |
| `absQuoteValueUSD` | `number` |
| `absBaseValueUSD` | `number` |
| `quoteIsStable` | `boolean` |
| `baseIsStable` | `boolean` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `lowerQuote` | `boolean` |
| `lowerUSD` | `number` |
| `upperUSD` | `number` |

#### Defined in

[utils/DefiPrices.ts:995](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L995)

___

### driver

▸ **driver**(`args?`): `Promise`<`void`\>

Driver

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | `DriverArgs` |

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiPrices.ts:54](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L54)

___

### getAllDaysOutLists

▸ `Private` **getAllDaysOutLists**(`missingTimes`): `Object`

Get All Days Out Lists

#### Parameters

| Name | Type |
| :------ | :------ |
| `missingTimes` | `TokenTimes` |

#### Returns

`Object`

#### Defined in

[utils/DefiPrices.ts:315](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L315)

___

### getAllTokenPrices

▸ `Private` **getAllTokenPrices**(`daysOutLists`, `supportedTokens`): `Promise`<`TokenPrices`\>

Get All Token Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `daysOutLists` | `Object` |
| `supportedTokens` | `StringDict` |

#### Returns

`Promise`<`TokenPrices`\>

#### Defined in

[utils/DefiPrices.ts:328](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L328)

___

### getBalances

▸ **getBalances**(`filterUnkownTokens?`): `Promise`<`void`\>

Get All Balances

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `filterUnkownTokens` | `boolean` | `true` |

#### Returns

`Promise`<`void`\>

#### Inherited from

DefiTransactions.getBalances

#### Defined in

[utils/DefiBalances.ts:90](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiBalances.ts#L90)

___

### getCoinGeckoEndpoint

▸ `Private` **getCoinGeckoEndpoint**(`endpoint`, `replaceArgs?`, `params?`): `Promise`<`any`\>

Get Coin Gecko Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyApy"`` \| ``"beefyVaults"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardSolWallet"`` \| ``"apeBoardSolfarm"`` \| ``"apeBoardHistory"`` \| ``"coinGeckoList"`` \| ``"coinGeckoPrices"`` \| ``"harmonyTokens"`` \| ``"harmonyVaults"`` |
| `replaceArgs?` | `any` |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/DefiPrices.ts:1175](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L1175)

___

### getDaysOutList

▸ `Private` **getDaysOutList**(`times`): `number`[]

Get Days Out List

#### Parameters

| Name | Type |
| :------ | :------ |
| `times` | `number`[] |

#### Returns

`number`[]

#### Defined in

[utils/DefiPrices.ts:1125](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L1125)

___

### getInsertRecords

▸ `Private` **getInsertRecords**(`localPrices`, `apiPrices`): `LocalPriceData`[]

Get Insert Records

#### Parameters

| Name | Type |
| :------ | :------ |
| `localPrices` | `TokenPrices` |
| `apiPrices` | `TokenPrices` |

#### Returns

`LocalPriceData`[]

#### Defined in

[utils/DefiPrices.ts:408](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L408)

___

### getLocalPrices

▸ `Private` **getLocalPrices**(`tokenNames`): `Promise`<`TokenPrices`\>

Get Local Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenNames` | `string`[] |

#### Returns

`Promise`<`TokenPrices`\>

#### Defined in

[utils/DefiPrices.ts:262](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L262)

___

### getPriceData

▸ `Private` **getPriceData**(): `Promise`<`void`\>

Get Price Data

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiPrices.ts:88](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L88)

___

### getSupportedTokens

▸ `Private` **getSupportedTokens**(): `Promise`<`StringDict`\>

Get Supported Tokens

#### Returns

`Promise`<`StringDict`\>

#### Defined in

[utils/DefiPrices.ts:137](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L137)

___

### getTokenPrices

▸ `Private` **getTokenPrices**(`tokenId`, `daysOutList`): `Promise`<`PriceData`[]\>

Get Token Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenId` | `string` |
| `daysOutList` | `number`[] |

#### Returns

`Promise`<`PriceData`[]\>

#### Defined in

[utils/DefiPrices.ts:1090](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L1090)

___

### getTokenTransactionTimes

▸ `Private` **getTokenTransactionTimes**(`supportedTokenNames`): `TokenTimes`

Get Token Transaction Times

#### Parameters

| Name | Type |
| :------ | :------ |
| `supportedTokenNames` | `string`[] |

#### Returns

`TokenTimes`

#### Defined in

[utils/DefiPrices.ts:210](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L210)

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

#### Inherited from

DefiTransactions.getTransactions

#### Defined in

[utils/DefiTransactions.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiTransactions.ts#L44)

___

### getUnknownTokens

▸ **getUnknownTokens**(): `void`

Get Unknown Tokens

#### Returns

`void`

#### Inherited from

DefiTransactions.getUnknownTokens

#### Defined in

[utils/DefiTransactions.ts:182](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiTransactions.ts#L182)

___

### getValidPriceRecord

▸ `Private` **getValidPriceRecord**(`transTime`, `priceTimes`): `undefined` \| `PriceData`

Get Valid Price Record

#### Parameters

| Name | Type |
| :------ | :------ |
| `transTime` | `number` |
| `priceTimes` | `PriceData`[] |

#### Returns

`undefined` \| `PriceData`

#### Defined in

[utils/DefiPrices.ts:1051](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L1051)

___

### importPriorTransactions

▸ `Private` **importPriorTransactions**(`records`): `void`

Import Prior Transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `records` | `HistoryRecord`[] |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:126](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L126)

___

### inferMultiSwap

▸ `Private` **inferMultiSwap**(`args`): `void`

Infer Multi Swap

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `InferMultiSwapArgs` |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:874](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L874)

___

### inferSingleSwap

▸ `Private` **inferSingleSwap**(`record`): `void`

Infer Single Swap

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | `HistoryRecord` |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:811](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L811)

___

### inferTransactionPrices

▸ `Private` **inferTransactionPrices**(): `void`

Infer Transaction Prices

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:609](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L609)

___

### linkLocalPrices

▸ `Private` **linkLocalPrices**(`transTokenTimes`, `localPrices`): `Object`

Link Local Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `transTokenTimes` | `TokenTimes` |
| `localPrices` | `TokenPrices` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `missingTimes` | `TokenTimes` |
| `transPrices` | `TokenPrices` |

#### Defined in

[utils/DefiPrices.ts:280](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L280)

___

### linkMergedPrices

▸ `Private` **linkMergedPrices**(`transPrices`, `mergedPrices`): `void`

Link Merged Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `transPrices` | `TokenPrices` |
| `mergedPrices` | `TokenPrices` |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:376](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L376)

___

### manageApiLimits

▸ `Private` **manageApiLimits**(): `void`

Manage API Limits

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:1208](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L1208)

___

### mergeApiAndLocalPrices

▸ `Private` **mergeApiAndLocalPrices**(`localPrices`, `apiPrices`): `TokenPrices`

Merge API and Local Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `localPrices` | `TokenPrices` |
| `apiPrices` | `TokenPrices` |

#### Returns

`TokenPrices`

#### Defined in

[utils/DefiPrices.ts:358](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L358)

___

### removeGarbagePriceInfo

▸ `Private` **removeGarbagePriceInfo**(): `undefined` \| ``false``

Remove Garbage Price Info

#### Returns

`undefined` \| ``false``

#### Defined in

[utils/DefiPrices.ts:565](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L565)

___

### setValueAndPrice

▸ `Private` **setValueAndPrice**(`record`, `value`, `type`): `void`

Set Value And Price

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | `HistoryRecord` |
| `value` | `number` |
| `type` | `BaseOrQuote` |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:963](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L963)

___

### syncMissingPrices

▸ `Private` **syncMissingPrices**(`insertRecords`): `Promise`<`void`\>

Sync Missing Prices

#### Parameters

| Name | Type |
| :------ | :------ |
| `insertRecords` | `LocalPriceData`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiPrices.ts:441](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L441)

___

### updateTransactionData

▸ `Private` **updateTransactionData**(`transPrices`): `void`

Update Transaction Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `transPrices` | `TokenPrices` |

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:453](https://github.com/edmundpf/multi-chain-balances-ts/blob/6fa7c96/src/utils/DefiPrices.ts#L453)
