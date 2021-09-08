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
- [nextApiCallMs](default.md#nextapicallms)
- [recentApiCalls](default.md#recentapicalls)
- [tokenNames](default.md#tokennames)
- [totalTokenValue](default.md#totaltokenvalue)
- [totalValue](default.md#totalvalue)
- [totalVaultValue](default.md#totalvaultvalue)
- [unknownTokens](default.md#unknowntokens)

### Methods

- [addTokenTime](default.md#addtokentime)
- [driver](default.md#driver)
- [getAddressStub](default.md#getaddressstub)
- [getAllDaysOutLists](default.md#getalldaysoutlists)
- [getAllTokenPrices](default.md#getalltokenprices)
- [getApeBoardEndpoint](default.md#getapeboardendpoint)
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
- [readTempFile](default.md#readtempfile)
- [sterilizeTokenName](default.md#sterilizetokenname)
- [sterilizeTokenNameNoStub](default.md#sterilizetokennamenostub)
- [syncMissingPrices](default.md#syncmissingprices)
- [updateTransactionData](default.md#updatetransactiondata)
- [writeTempFile](default.md#writetempfile)

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

[utils/DefiBalances.ts:54](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L54)

## Properties

### address

• **address**: `string` = `''`

#### Inherited from

DefiTransactions.address

#### Defined in

[utils/DefiBalances.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L40)

___

### assets

• **assets**: `Assets` = `{}`

#### Inherited from

DefiTransactions.assets

#### Defined in

[utils/DefiBalances.ts:45](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L45)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Inherited from

DefiTransactions.chainNames

#### Defined in

[utils/DefiBalances.ts:46](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L46)

___

### chains

• **chains**: `Chains`

#### Inherited from

DefiTransactions.chains

#### Defined in

[utils/DefiBalances.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L44)

___

### nextApiCallMs

• `Private` **nextApiCallMs**: `number` = `0`

#### Defined in

[utils/DefiPrices.ts:34](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L34)

___

### recentApiCalls

• `Private` **recentApiCalls**: `number`[] = `[]`

#### Defined in

[utils/DefiPrices.ts:35](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L35)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Inherited from

DefiTransactions.tokenNames

#### Defined in

[utils/DefiBalances.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L47)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalTokenValue

#### Defined in

[utils/DefiBalances.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L42)

___

### totalValue

• **totalValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalValue

#### Defined in

[utils/DefiBalances.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L41)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Inherited from

DefiTransactions.totalVaultValue

#### Defined in

[utils/DefiBalances.ts:43](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L43)

___

### unknownTokens

• **unknownTokens**: `string`[] = `[]`

#### Inherited from

DefiTransactions.unknownTokens

#### Defined in

[utils/DefiBalances.ts:48](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L48)

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

[utils/DefiPrices.ts:947](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L947)

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

[utils/DefiPrices.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L41)

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

[utils/DefiBalances.ts:590](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L590)

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

[utils/DefiPrices.ts:243](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L243)

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

[utils/DefiPrices.ts:256](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L256)

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

[utils/DefiBalances.ts:122](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L122)

___

### getBalances

▸ **getBalances**(): `Promise`<`void`\>

Get All Balances

#### Returns

`Promise`<`void`\>

#### Inherited from

DefiTransactions.getBalances

#### Defined in

[utils/DefiBalances.ts:77](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L77)

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

[utils/DefiPrices.ts:872](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L872)

___

### getDaysOutList

▸ `Private` **getDaysOutList**(`times`): `number`[]

Get Days Out Lits

#### Parameters

| Name | Type |
| :------ | :------ |
| `times` | `number`[] |

#### Returns

`number`[]

#### Defined in

[utils/DefiPrices.ts:822](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L822)

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

[utils/DefiBalances.ts:97](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L97)

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

[utils/DefiPrices.ts:336](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L336)

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

[utils/DefiPrices.ts:190](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L190)

___

### getPriceData

▸ `Private` **getPriceData**(`useTempTransactions?`): `Promise`<`void`\>

Get Price Data

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `useTempTransactions` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/DefiPrices.ts:65](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L65)

___

### getSupportedTokens

▸ `Private` **getSupportedTokens**(): `Promise`<`StringDict`\>

Get Supported Tokens

#### Returns

`Promise`<`StringDict`\>

#### Defined in

[utils/DefiPrices.ts:127](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L127)

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

[utils/DefiPrices.ts:981](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L981)

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

[utils/DefiPrices.ts:787](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L787)

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

[utils/DefiPrices.ts:147](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L147)

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

[utils/DefiTransactions.ts:31](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiTransactions.ts#L31)

___

### getUnknownTokens

▸ **getUnknownTokens**(): `void`

Get Unknown Tokens

#### Returns

`void`

#### Inherited from

DefiTransactions.getUnknownTokens

#### Defined in

[utils/DefiTransactions.ts:533](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiTransactions.ts#L533)

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

[utils/DefiPrices.ts:748](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L748)

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

[utils/DefiPrices.ts:632](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L632)

___

### inferTransactionPrices

▸ `Private` **inferTransactionPrices**(): `void`

Infer Transaction Prices

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:492](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L492)

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

[utils/DefiBalances.ts:539](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L539)

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

[utils/DefiBalances.ts:525](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L525)

___

### isUnknownToken

▸ **isUnknownToken**(`record`, `chainName`): `boolean`

Is Unknown Token

#### Parameters

| Name | Type |
| :------ | :------ |
| `record` | `TokenData` |
| `chainName` | keyof `Chains` |

#### Returns

`boolean`

#### Inherited from

DefiTransactions.isUnknownToken

#### Defined in

[utils/DefiBalances.ts:547](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L547)

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

[utils/DefiPrices.ts:965](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L965)

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

[utils/DefiPrices.ts:973](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L973)

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

[utils/DefiPrices.ts:208](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L208)

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

[utils/DefiPrices.ts:304](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L304)

___

### manageApiLimits

▸ `Private` **manageApiLimits**(): `void`

Manage API Limits

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:914](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L914)

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

[utils/DefiPrices.ts:286](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L286)

___

### readTempFile

▸ `Private` **readTempFile**(): `boolean`

Read Temp File

#### Returns

`boolean`

#### Defined in

[utils/DefiPrices.ts:98](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L98)

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

[utils/DefiBalances.ts:559](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L559)

___

### sterilizeTokenNameNoStub

▸ **sterilizeTokenNameNoStub**(`tokenName`, `chainName`): `string`

Remove Token Contract Stub

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenName` | `string` |
| `chainName` | keyof `Chains` |

#### Returns

`string`

#### Inherited from

DefiTransactions.sterilizeTokenNameNoStub

#### Defined in

[utils/DefiBalances.ts:567](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiBalances.ts#L567)

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

[utils/DefiPrices.ts:369](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L369)

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

[utils/DefiPrices.ts:381](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L381)

___

### writeTempFile

▸ `Private` **writeTempFile**(): `void`

Write Temp File

#### Returns

`void`

#### Defined in

[utils/DefiPrices.ts:115](https://github.com/edmundpf/multi-chain-balances-ts/blob/b7c0549/src/utils/DefiPrices.ts#L115)
