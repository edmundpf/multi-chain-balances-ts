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

[utils/DefiBalances.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L47)

## Properties

### address

• **address**: `string` = `''`

#### Inherited from

DefiTransactions.address

#### Defined in

[utils/DefiBalances.ts:33](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L33)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiTransactions.assets

#### Defined in

[utils/DefiBalances.ts:38](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L38)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiTransactions.chainNames

#### Defined in

[utils/DefiBalances.ts:39](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L39)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiTransactions.chains

#### Defined in

[utils/DefiBalances.ts:37](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L37)

___

### filterUnknownTokens

• `Private` **filterUnknownTokens**: `boolean` = `false`

#### Defined in

[utils/DefiPrices.ts:36](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L36)

___

### nextApiCallMs

• `Private` **nextApiCallMs**: `number` = `0`

#### Defined in

[utils/DefiPrices.ts:34](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L34)

___

### recentApiCalls

• `Private` **recentApiCalls**: `number`[] = `[]`

#### Defined in

[utils/DefiPrices.ts:35](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L35)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiTransactions.tokenNames

#### Defined in

[utils/DefiBalances.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L40)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:35](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L35)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalValue

#### Defined in

[utils/DefiBalances.ts:34](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L34)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:36](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L36)

___

### unknownTokens

• **unknownTokens**: `string`[] = `[]`

#### Inherited from

DefiTransactions.unknownTokens

#### Defined in

[utils/DefiBalances.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L41)

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

[utils/DefiPrices.ts:1239](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1239)

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

[utils/DefiPrices.ts:984](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L984)

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

[utils/DefiPrices.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L42)

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

[utils/DefiBalances.ts:286](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L286)

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

[utils/DefiPrices.ts:304](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L304)

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

[utils/DefiPrices.ts:317](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L317)

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

[utils/DefiBalances.ts:212](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L212)

___

### getAssetsAndTotalValues

▸ **getAssetsAndTotalValues**(): `void`

Get Assets & Total Values

#### Returns

`void`

#### Inherited from

DefiTransactions.getAssetsAndTotalValues

#### Defined in

[utils/DefiBalances.ts:90](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L90)

___

### getBalances

▸ **getBalances**(): `Promise`<`void`\>

Get All Balances

#### Returns

`Promise`<`void`\>

#### Inherited from

DefiTransactions.getBalances

#### Defined in

[utils/DefiBalances.ts:70](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L70)

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

[utils/DefiPrices.ts:1164](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1164)

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

[utils/DefiPrices.ts:1114](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1114)

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

[utils/DefiBalances.ts:184](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L184)

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

[utils/DefiPrices.ts:397](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L397)

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

[utils/DefiPrices.ts:251](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L251)

___

### getPriceData

▸ `Private` **getPriceData**(): `Promise`<`void`\>

Get Price Data

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiPrices.ts:75](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L75)

___

### getSupportedTokens

▸ `Private` **getSupportedTokens**(): `Promise`<`StringDict`\>

Get Supported Tokens

#### Returns

`Promise`<`StringDict`\>

#### Defined in

[utils/DefiPrices.ts:126](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L126)

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

[utils/DefiPrices.ts:1273](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1273)

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

[utils/DefiPrices.ts:1079](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1079)

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

[utils/DefiPrices.ts:199](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L199)

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

[utils/DefiTransactions.ts:31](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiTransactions.ts#L31)

___

### getUnknownTokens

▸ **getUnknownTokens**(): `void`

Get Unknown Tokens

#### Returns

`void`

#### Inherited from

DefiTransactions.getUnknownTokens

#### Defined in

[utils/DefiTransactions.ts:162](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiTransactions.ts#L162)

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

[utils/DefiPrices.ts:1040](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1040)

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

[utils/DefiPrices.ts:115](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L115)

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

[utils/DefiPrices.ts:863](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L863)

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

[utils/DefiPrices.ts:800](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L800)

___

### inferTransactionPrices

▸ `Private` **inferTransactionPrices**(): `void`

Infer Transaction Prices

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:598](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L598)

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

[utils/DefiBalances.ts:242](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L242)

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

[utils/DefiBalances.ts:228](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L228)

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

[utils/DefiBalances.ts:250](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L250)

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

[utils/DefiPrices.ts:1257](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1257)

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

[utils/DefiPrices.ts:1265](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1265)

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

[utils/DefiPrices.ts:269](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L269)

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

[utils/DefiPrices.ts:365](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L365)

___

### manageApiLimits

▸ `Private` **manageApiLimits**(): `void`

Manage API Limits

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:1206](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L1206)

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

[utils/DefiPrices.ts:347](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L347)

___

### removeGarbagePriceInfo

▸ `Private` **removeGarbagePriceInfo**(): `undefined` \| ``false``

Remove Garbage Price Info

#### Returns

`undefined` \| ``false``

#### Defined in

[utils/DefiPrices.ts:554](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L554)

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

[utils/DefiPrices.ts:952](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L952)

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

[utils/DefiBalances.ts:259](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L259)

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

[utils/DefiBalances.ts:267](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiBalances.ts#L267)

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

[utils/DefiPrices.ts:430](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L430)

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

[utils/DefiPrices.ts:442](https://github.com/edmundpf/multi-chain-balances-ts/blob/737ec2e/src/utils/DefiPrices.ts#L442)
