[Documentation](README.md) / Exports

# Documentation

## Table of contents

### Classes

- [InstructionObservable](undefined)
- [InstructionObserver](undefined)
- [Interface](undefined)
- [NoSubscribersError](undefined)
- [Observable](undefined)
- [Observer](undefined)
- [UnacceptedEventTypesError](undefined)

### Interfaces

- [ObserverDataIF](undefined)

### Type Aliases

- [InstructionCallback](undefined)
- [InstructionEventType](undefined)

## Classes

### InstructionObservable

• **InstructionObservable**: Class InstructionObservable

Classe que representa um Observable de instruções.

#### Defined in

[main.ts:182](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L182)

___

### InstructionObserver

• **InstructionObserver**: Class InstructionObserver

Classe que representa um Observer de instruções.

#### Defined in

[main.ts:177](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L177)

___

### Interface

• **Interface**: Class Interface

Classe que representa o controlador de interface.

#### Defined in

[main.ts:191](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L191)

___

### NoSubscribersError

• **NoSubscribersError**: Class NoSubscribersError

#### Defined in

[main.ts:7](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L7)

___

### Observable

• **Observable**: Class Observable<DataT, ObserverT\>

Classe que representa um observable.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataT` | extends ObserverDataIF |
| `ObserverT` | extends Observer<DataT\> |

#### Defined in

[main.ts:82](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L82)

___

### Observer

• **Observer**: Class Observer<DataT\>

Classe que representa um Observer.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataT` | extends ObserverDataIF |

#### Defined in

[main.ts:30](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L30)

___

### UnacceptedEventTypesError

• **UnacceptedEventTypesError**: Class UnacceptedEventTypesError

#### Defined in

[main.ts:1](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L1)

## Interfaces

### ObserverDataIF

• **ObserverDataIF**: Interface ObserverDataIF

Interface para dados de um Observer.

#### Defined in

[main.ts:16](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L16)

## Type Aliases

### InstructionCallback

Ƭ **InstructionCallback**: Function

#### Type declaration

▸ (`data`): void

Tipo de callback de instrução.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | ObserverDataIF |

##### Returns

void

#### Defined in

[main.ts:172](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L172)

___

### InstructionEventType

Ƭ **InstructionEventType**: "slide\_left" \| "slide\_right" \| "slide\_up" \| "slide\_down" \| "single\_touch"

Tipo de event de instrução.

#### Defined in

[main.ts:167](https://github.com/moccot/aplicacao_computacao_e_socidedade/blob/1d99269/main.ts#L167)
