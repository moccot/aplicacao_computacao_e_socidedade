/**
 * Interface para dados de um Observer.
 */
interface ObserverDataIF {
    /**
     * O tipo do evento que entregou o dado.
     */
    eventType: string;
    /**
     * O dado que foi entregado.
     */
    data: any;
}

/**
 * Classe que representa um Observer.
 */
class Observer<DataT extends ObserverDataIF> {
    /**
     * O tipo de evento pelo Observer.
     */
    private readonly acceptedEventType: string;

    /**
     * Callback com a lógica de processamento de dados recebidos por meio do evento aceito pelo Observer.
     * @param data - O dado recebido por meio do evento aceito pelo Observer.
     */
    private customUpdate: (data: DataT) => {};

    /**
     * @param acceptedEventType - O tipo de evento aceito pelo Observer.
     * @param customUpdate - Callback com a lógica de processamento de dados recebidos por meio do evento aceito pelo Observer.
     */
    constructor (acceptedEventType: string, customUpdate: (data: DataT) => {}) {
        this.acceptedEventType = acceptedEventType;
        this.customUpdate = customUpdate;
    }

    /**
     * Define a propriedade customUpdate.
     */
    setCustomUpdate(customUpdate: (data: DataT) => {}) {
        this.customUpdate = customUpdate;
    }

    /**
     * Lógica interna de atualização do Observer.
     * @param data - O dado recebido por meio do evento aceito pelo Observer.
     */
    _update(data: DataT) {
        if (data.eventType === this.acceptedEventType)
            this.customUpdate(data);
        else
            throw new Error(`Unnaccepted eventType (${data.eventType}) for Observer. Accepted eventType (${this.acceptedEventType})`);
    }
}

/**
 * Classe que representa um observable.
 */
class Observable<DataT extends ObserverDataIF, ObserverT extends Observer<DataT>> {
    /**
     * Uma lista de todos os eventos que o Observable emite.
     */
    private readonly acceptedEventTypes: string[];

    /**
     * Uma lista com todos os Observer's inscritos ao Observable separados por tipo de evento.
     */
    private readonly subscribers: {[index: string]: ObserverT[] | undefined} = {};

    /**
     * @param acceptedEventTypes Uma lista com todos os Observer's inscritos ao Observable separados por tipo de evento.
     */
    constructor (acceptedEventTypes: string[]) {
        this.acceptedEventTypes = acceptedEventTypes;
    }

    /**
     * Increve um observer.
     * @param eventType O tipo do evento em que o Observer será inscrito.
     * @param observer O observer que será inscrito.
     */
    subscribe (eventType: string, observer: ObserverT) {
        if (eventType in this.acceptedEventTypes) {
            if (!this.subscribers[eventType]) {
                this.subscribers[eventType] = [];
            }

            this.subscribers[eventType]?.push(observer);
        }

        else {
            throw new Error(`Unnaccepted eventType (${eventType}) for Observable. Accepted eventTypes (${this.acceptedEventTypes})`);
        }
    }

    /**
     * Desinscreve um Observer.
     * @param eventType O tipo do evento do qual o Observer será desinscrito.
     * @param observer O observer que será desinscrito.
     */
    unsubscribe (eventType: string, observer: ObserverT) {
        if (eventType in this.acceptedEventTypes) {
            if (!this.subscribers[eventType] || this.subscribers[eventType]?.length === 0) {
                throw new Error(`There are no subscribers for such event type (${eventType}).`)
            }

            for (let subscriber of this.subscribers[eventType]!) {
                if (subscriber === observer) {
                    let observerIndex = this.subscribers[eventType]!.indexOf(subscriber);
                    delete this.subscribers[eventType]![observerIndex];
                }
            }
        }

        else {
            throw new Error(`Unnaccepted eventType (${eventType}) for Observable. Accepted eventTypes (${this.acceptedEventTypes})`);
        }
    }

    /**
     * Emite determinado tipo de evento com dados.
     * @param eventType Tipo de evento a ser emitido.
     * @param data O dado a ser entregue por meio do evento.
     */
    notifyAllSubscribers(eventType: string, data: DataT) {
        if (eventType in this.acceptedEventTypes) {
            if (!this.subscribers[eventType] || this.subscribers[eventType]?.length === 0) {
                throw new Error(`There are no subscribers for such event type (${eventType}).`)
            }

            for (let subscriber of this.subscribers[eventType]!) {
                subscriber._update(data);
            }
        }

        else {
            throw new Error(`Unnaccepted eventType (${eventType}) for Observable. Accepted eventTypes (${this.acceptedEventTypes})`);
        }
    }
}

interface InstructionDataIF extends ObserverDataIF {
    eventType: "slide_left" | "slide_right" | "slide_up" | "slide_down" | "single_touch" | "double touch";
}

class InstructionObserver extends Observer<InstructionDataIF> {}
class InstructionObservable extends Observable<InstructionDataIF, InstructionObserver> {
    constructor () {
        super(["slide_left", "slide_right", "slide_up", "slide_down", "single_touch", "double touch"]);
    }
}

class Interface {
    constructor (vector: HTMLElement) {
        
    }
}
