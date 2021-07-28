[multi-chain-balances-ts](../README.md) / [Exports](../modules.md) / default

# Class: default

MultiChain Class

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

- [driver](default.md#driver)
- [getApeBoardEndpoint](default.md#getapeboardendpoint)
- [getApeBoardPositions](default.md#getapeboardpositions)
- [getBeefyApy](default.md#getbeefyapy)
- [getBeefyEndpoint](default.md#getbeefyendpoint)
- [getDebankEndpoint](default.md#getdebankendpoint)
- [getEndpoint](default.md#getendpoint)
- [getProtocolList](default.md#getprotocollist)
- [getTokenList](default.md#gettokenlist)
- [parseApyData](default.md#parseapydata)
- [parseChainData](default.md#parsechaindata)
- [parseProtocolData](default.md#parseprotocoldata)
- [parseTokenData](default.md#parsetokendata)

## Constructors

### constructor

• **new default**()

Constructor

#### Defined in

[utils/MultiChain.ts:52](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L52)

## Properties

### address

• **address**: `string`

#### Defined in

[utils/MultiChain.ts:39](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L39)

___

### assets

• **assets**: `NumDict` = `{}`

#### Defined in

[utils/MultiChain.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L44)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Defined in

[utils/MultiChain.ts:45](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L45)

___

### chains

• **chains**: `Chains`

#### Defined in

[utils/MultiChain.ts:43](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L43)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Defined in

[utils/MultiChain.ts:46](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L46)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L41)

___

### totalValue

• **totalValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:40](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L40)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L42)

## Methods

### driver

▸ **driver**(): `Promise`<`void`\>

Driver

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/MultiChain.ts:60](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L60)

___

### getApeBoardEndpoint

▸ `Private` **getApeBoardEndpoint**(`endpoint`): `Promise`<`any`\>

Get Ape Board Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:526](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L526)

___

### getApeBoardPositions

▸ **getApeBoardPositions**(): `Promise`<`ApeBoardPositions`\>

Get Ape Board Positions

#### Returns

`Promise`<`ApeBoardPositions`\>

#### Defined in

[utils/MultiChain.ts:428](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L428)

___

### getBeefyApy

▸ `Private` **getBeefyApy**(): `Promise`<`any`\>

Get Beefy APY

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:420](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L420)

___

### getBeefyEndpoint

▸ `Private` **getBeefyEndpoint**(`endpoint`): `Promise`<`any`\>

Get Beefy Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:518](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L518)

___

### getDebankEndpoint

▸ `Private` **getDebankEndpoint**(`endpoint`): `Promise`<`any`\>

Get Debank Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:506](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L506)

___

### getEndpoint

▸ `Private` **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"debank"`` \| ``"beefy"`` \| ``"apeBoard"`` |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:479](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L479)

___

### getProtocolList

▸ `Private` **getProtocolList**(): `Promise`<`any`\>

Get Protocol List

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:412](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L412)

___

### getTokenList

▸ `Private` **getTokenList**(): `Promise`<`any`\>

Get Token List

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:404](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L404)

___

### parseApyData

▸ `Private` **parseApyData**(`positionData`, `apyData`): `void`

Parse APY Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `positionData` | `ApeBoardPositions` |
| `apyData` | `NumDict` |

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:192](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L192)

___

### parseChainData

▸ `Private` **parseChainData**(): `void`

Parse Chain Data

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:321](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L321)

___

### parseProtocolData

▸ `Private` **parseProtocolData**(`data`): `void`

Parse Protocol Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Protocol`[] |

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:127](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L127)

___

### parseTokenData

▸ `Private` **parseTokenData**(`data`): `void`

Parse Token Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Token`[] |

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:82](https://github.com/edmundpf/multi-chain-balances-ts/blob/cf1647f/src/utils/MultiChain.ts#L82)
