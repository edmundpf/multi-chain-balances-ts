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
- [getAddressStub](default.md#getaddressstub)
- [getAllDaysOutLists](default.md#getalldaysoutlists)
- [getAllTokenPrices](default.md#getalltokenprices)
- [getApeBoardEndpoint](default.md#getapeboardendpoint)
- [getAssetsAndTotalValues](default.md#getassetsandtotalvalues)
- [getBalances](default.md#getbalances)
- [getCoinGeckoEndpoint](default.md#getcoingeckoendpoint)
- [getDaysOutList](default.md#getdaysoutlist)
- [getEndpoint](default.md#getendpoint)
- [getInsertRecords](default.md#getinsertrecords)
- [getLocalPrices](default.md#getlocalprices)
- [getPriceData](default.md#getpricedata)
- [getSupportedTokens](default.md#getsupportedtokens)
- [getTimeMs](default.md#gettimems)
- [getTokenPrices](default.md#gettokenprices)
- [getTokenTransactionTimes](default.md#gettokentransactiontimes)
- [getTransactions](default.md#gettransactions)
- [getUnknownTokens](default.md#getunknowntokens)
- [getValidPriceRecord](default.md#getvalidpricerecord)
- [importPriorTransactions](default.md#importpriortransactions)
- [inferMultiSwap](default.md#infermultiswap)
- [inferSingleSwap](default.md#infersingleswap)
- [inferTransactionPrices](default.md#infertransactionprices)
- [isNativeToken](default.md#isnativetoken)
- [isStableCoin](default.md#isstablecoin)
- [isUnknownToken](default.md#isunknowntoken)
- [isValidFutureTime](default.md#isvalidfuturetime)
- [isValidPastTime](default.md#isvalidpasttime)
- [linkLocalPrices](default.md#linklocalprices)
- [linkMergedPrices](default.md#linkmergedprices)
- [manageApiLimits](default.md#manageapilimits)
- [mergeApiAndLocalPrices](default.md#mergeapiandlocalprices)
- [removeGarbagePriceInfo](default.md#removegarbagepriceinfo)
- [setValueAndPrice](default.md#setvalueandprice)
- [sterilizeTokenName](default.md#sterilizetokenname)
- [sterilizeTokenNameNoStub](default.md#sterilizetokennamenostub)
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

[utils/DefiBalances.ts:48](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L48)

## Properties

### address

• **address**: `string` = `''`

#### Inherited from

DefiTransactions.address

#### Defined in

[utils/DefiBalances.ts:34](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L34)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiTransactions.assets

#### Defined in

[utils/DefiBalances.ts:39](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L39)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiTransactions.chainNames

#### Defined in

[utils/DefiBalances.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L40)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiTransactions.chains

#### Defined in

[utils/DefiBalances.ts:38](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L38)

___

### filterUnknownTokens

• `Private` **filterUnknownTokens**: `boolean` = `false`

#### Defined in

[utils/DefiPrices.ts:36](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L36)

___

### nextApiCallMs

• `Private` **nextApiCallMs**: `number` = `0`

#### Defined in

[utils/DefiPrices.ts:34](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L34)

___

### recentApiCalls

• `Private` **recentApiCalls**: `number`[] = `[]`

#### Defined in

[utils/DefiPrices.ts:35](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L35)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiTransactions.tokenNames

#### Defined in

[utils/DefiBalances.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L41)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:36](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L36)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalValue

#### Defined in

[utils/DefiBalances.ts:35](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L35)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:37](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L37)

___

### unknownTokens

• **unknownTokens**: `string`[] = `[]`

#### Inherited from

DefiTransactions.unknownTokens

#### Defined in

[utils/DefiBalances.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L42)

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

[utils/DefiPrices.ts:1238](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1238)

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

[utils/DefiPrices.ts:983](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L983)

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

[utils/DefiPrices.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L42)

___

### getAddressStub

▸ **getAddressStub**(`address`): `string`

Get Address Stub

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`string`

#### Inherited from

DefiTransactions.getAddressStub

#### Defined in

[utils/DefiBalances.ts:289](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L289)

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

[utils/DefiPrices.ts:303](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L303)

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

[utils/DefiPrices.ts:316](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L316)

___

### getApeBoardEndpoint

▸ **getApeBoardEndpoint**(`endpoint`): `Promise`<`any`\>

Get Ape Board Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyApy"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardHistory"`` \| ``"coinGeckoList"`` \| ``"coinGeckoPrices"`` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiTransactions.getApeBoardEndpoint

#### Defined in

[utils/DefiBalances.ts:215](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L215)

___

### getAssetsAndTotalValues

▸ **getAssetsAndTotalValues**(): `void`

Get Assets & Total Values

#### Returns

`void`

#### Inherited from

DefiTransactions.getAssetsAndTotalValues

#### Defined in

[utils/DefiBalances.ts:93](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L93)

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

[utils/DefiBalances.ts:71](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L71)

___

### getCoinGeckoEndpoint

▸ `Private` **getCoinGeckoEndpoint**(`endpoint`, `replaceArgs?`, `params?`): `Promise`<`any`\>

Get Coin Gecko Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyApy"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardHistory"`` \| ``"coinGeckoList"`` \| ``"coinGeckoPrices"`` |
| `replaceArgs?` | `any` |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/DefiPrices.ts:1163](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1163)

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

[utils/DefiPrices.ts:1113](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1113)

___

### getEndpoint

▸ **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"beefy"`` \| ``"apeBoard"`` \| ``"debank"`` \| ``"debankPrivate"`` \| ``"coinGecko"`` |
| `endpoint` | ``"beefyApy"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"debankHistory"`` \| ``"apeBoardHistory"`` \| ``"coinGeckoList"`` \| ``"coinGeckoPrices"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DefiTransactions.getEndpoint

#### Defined in

[utils/DefiBalances.ts:187](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L187)

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

[utils/DefiPrices.ts:396](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L396)

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

[utils/DefiPrices.ts:250](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L250)

___

### getPriceData

▸ `Private` **getPriceData**(): `Promise`<`void`\>

Get Price Data

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiPrices.ts:76](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L76)

___

### getSupportedTokens

▸ `Private` **getSupportedTokens**(): `Promise`<`StringDict`\>

Get Supported Tokens

#### Returns

`Promise`<`StringDict`\>

#### Defined in

[utils/DefiPrices.ts:125](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L125)

___

### getTimeMs

▸ `Private` **getTimeMs**(`dateStr?`): `number`

Get Time in ms

#### Parameters

| Name | Type |
| :------ | :------ |
| `dateStr?` | `string` |

#### Returns

`number`

#### Defined in

[utils/DefiPrices.ts:1272](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1272)

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

[utils/DefiPrices.ts:1078](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1078)

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

[utils/DefiPrices.ts:198](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L198)

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

[utils/DefiTransactions.ts:33](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiTransactions.ts#L33)

___

### getUnknownTokens

▸ **getUnknownTokens**(): `void`

Get Unknown Tokens

#### Returns

`void`

#### Inherited from

DefiTransactions.getUnknownTokens

#### Defined in

[utils/DefiTransactions.ts:171](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiTransactions.ts#L171)

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

[utils/DefiPrices.ts:1039](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1039)

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

[utils/DefiPrices.ts:114](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L114)

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

[utils/DefiPrices.ts:862](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L862)

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

[utils/DefiPrices.ts:799](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L799)

___

### inferTransactionPrices

▸ `Private` **inferTransactionPrices**(): `void`

Infer Transaction Prices

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:597](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L597)

___

### isNativeToken

▸ **isNativeToken**(`tokenName`): `boolean`

Is Native Token

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenName` | `string` |

#### Returns

`boolean`

#### Inherited from

DefiTransactions.isNativeToken

#### Defined in

[utils/DefiBalances.ts:245](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L245)

___

### isStableCoin

▸ **isStableCoin**(`tokenName`, `price`): `boolean`

Is Stable Coin

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenName` | `string` |
| `price` | `number` |

#### Returns

`boolean`

#### Inherited from

DefiTransactions.isStableCoin

#### Defined in

[utils/DefiBalances.ts:231](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L231)

___

### isUnknownToken

▸ **isUnknownToken**(`symbol`): `boolean`

Is Unknown Token

#### Parameters

| Name | Type |
| :------ | :------ |
| `symbol` | `string` |

#### Returns

`boolean`

#### Inherited from

DefiTransactions.isUnknownToken

#### Defined in

[utils/DefiBalances.ts:253](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L253)

___

### isValidFutureTime

▸ `Private` **isValidFutureTime**(`transTime`, `localTime`): `boolean`

Is Valid Future Time

#### Parameters

| Name | Type |
| :------ | :------ |
| `transTime` | `number` |
| `localTime` | `number` |

#### Returns

`boolean`

#### Defined in

[utils/DefiPrices.ts:1256](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1256)

___

### isValidPastTime

▸ `Private` **isValidPastTime**(`transTime`, `localTime`): `boolean`

Is Valid Past Time

#### Parameters

| Name | Type |
| :------ | :------ |
| `transTime` | `number` |
| `localTime` | `number` |

#### Returns

`boolean`

#### Defined in

[utils/DefiPrices.ts:1264](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1264)

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

[utils/DefiPrices.ts:268](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L268)

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

[utils/DefiPrices.ts:364](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L364)

___

### manageApiLimits

▸ `Private` **manageApiLimits**(): `void`

Manage API Limits

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:1205](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L1205)

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

[utils/DefiPrices.ts:346](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L346)

___

### removeGarbagePriceInfo

▸ `Private` **removeGarbagePriceInfo**(): `undefined` \| ``false``

Remove Garbage Price Info

#### Returns

`undefined` \| ``false``

#### Defined in

[utils/DefiPrices.ts:553](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L553)

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

[utils/DefiPrices.ts:951](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L951)

___

### sterilizeTokenName

▸ **sterilizeTokenName**(`token`): `string`

Sterilize Token Name

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`string`

#### Inherited from

DefiTransactions.sterilizeTokenName

#### Defined in

[utils/DefiBalances.ts:262](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L262)

___

### sterilizeTokenNameNoStub

▸ **sterilizeTokenNameNoStub**(`tokenName`): `string`

Remove Token Contract Stub

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenName` | `string` |

#### Returns

`string`

#### Inherited from

DefiTransactions.sterilizeTokenNameNoStub

#### Defined in

[utils/DefiBalances.ts:270](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiBalances.ts#L270)

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

[utils/DefiPrices.ts:429](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L429)

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

[utils/DefiPrices.ts:441](https://github.com/edmundpf/multi-chain-balances-ts/blob/e2c3f92/src/utils/DefiPrices.ts#L441)
