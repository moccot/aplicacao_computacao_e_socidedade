"use strict";
class UnacceptedEventTypesError extends Error {
    constructor(unacceptedEventType, acceptedEventTypes) {
        super(`Unnaccepted event type (${unacceptedEventType}) for Observable. Accepted event types (${acceptedEventTypes})`);
    }
}
class NoSubscribersError extends Error {
    constructor(eventType) {
        super(`There are no subscribers for such event type (${eventType}).`);
    }
}
/**
 * Classe que representa um Observer.
 */
class Observer {
    /**
     * @param acceptedEventType - O tipo de evento aceito pelo Observer.
     * @param customUpdate - Callback com a lógica de processamento de dados recebidos por meio do evento aceito pelo Observer.
     */
    constructor(acceptedEventType, customUpdate) {
        this.acceptedEventType = acceptedEventType;
        this.customUpdate = customUpdate;
    }
    /**
     * Define a propriedade customUpdate.
     */
    setCustomUpdate(customUpdate) {
        this.customUpdate = customUpdate;
    }
    /**
     * Anula a propriedade customUpdate.
     */
    unsetCustomUpdate() {
        delete this.customUpdate;
    }
    /**
     * Lógica interna de atualização do Observer.
     * @param data - O dado passado pelo Observable em qual o Observer está inscrito.
     */
    _update(data) {
        /**
         * Se o tipo do evento que gerou o dado não for aceito pelo Observer, atira um erro.
         */
        if (data.eventType !== this.acceptedEventType)
            throw new Error(`Unnaccepted event type (${data.eventType}) for Observer. Accepted event type (${this.acceptedEventType})`);
        /**
         * Se a propriedade customUpdate for um falsy, avise que ela pode não ter sido definida ou foi anulada.
         */
        if (!this.customUpdate)
            console.warn("Property customUpdate was not defined for Observer or was unset.");
        /**
         * Se não, chame customUpdate passando o dado.
         */
        else
            this.customUpdate(data);
    }
}
/**
 * Classe que representa um observable.
 */
class Observable {
    /**
     * @param acceptedEventTypes Uma lista com todos os Observer's inscritos ao Observable separados por tipo de evento.
     */
    constructor(acceptedEventTypes) {
        /**
         * Uma lista com todos os Observer's inscritos ao Observable separados por tipo de evento.
         */
        this.subscribers = {};
        this.acceptedEventTypes = acceptedEventTypes;
        for (let acceptedEventType of this.acceptedEventTypes) {
            this.subscribers[acceptedEventType] = [];
        }
    }
    /**
     * Inscreve um observer.
     * @param eventType O tipo do evento em que o Observer será inscrito.
     * @param observer O observer que será inscrito.
     */
    subscribe(eventType, observer) {
        /**
         * Se o tipo de evento no qual o Observer será inscrito não é existe na lista de tipos de evento aceitos pelo Observable, atira um erro.
         */
        if (!this.acceptedEventTypes.includes(eventType))
            throw new UnacceptedEventTypesError(eventType, this.acceptedEventTypes);
        /**
         * Se sim, inscreve o Observer naquele tipo de evento.
         */
        this.subscribers[eventType].push(observer);
    }
    /**
     * Desinscreve um Observer.
     * @param eventType O tipo do evento do qual o Observer será desinscrito.
     * @param observer O observer que será desinscrito.
     */
    unsubscribe(eventType, observer) {
        /**
         * Se o tipo de evento do qual o Observer será desinscrito não é existe na lista de tipos de evento aceitos pelo Observable, atira um erro.
         */
        if (!this.acceptedEventTypes.includes(eventType))
            throw new UnacceptedEventTypesError(eventType, this.acceptedEventTypes);
        /**
         * Se sim, testa se a lista de Observer's inscritos nesse tipo de evento está vazia, se sim, atira um erro.
         */
        if (this.subscribers[eventType].length === 0)
            throw new NoSubscribersError(eventType);
        /**
         * Se não, procura pelo Observer nessa lista e o remove, se ele não for encontrado, atira um erro.
         */
        for (let subscriber of this.subscribers[eventType]) {
            if (subscriber === observer) {
                let observerIndex = this.subscribers[eventType].indexOf(subscriber);
                delete this.subscribers[eventType][observerIndex];
            }
        }
        throw new Error("Could not remove Observer: Observer not found.");
    }
    /**
     * Emite determinado tipo de evento com dados.
     * @param eventType Tipo de evento a ser emitido.
     * @param data O dado a ser entregue por meio do evento.
     */
    notifyAllSubscribers(eventType, data) {
        /**
         * Se o tipo de evento no qual o dado será propagado não existir na lista de tipos de evento aceitos pelo Observable, atira um erro.
         */
        if (!this.acceptedEventTypes.includes(eventType))
            throw new UnacceptedEventTypesError(eventType, this.acceptedEventTypes);
        /**
         * Se sim, testa se a lista de Observer's inscritos nesse tipo de evento está vazia, se sim, atira um erro.
         */
        if (this.subscribers[eventType].length === 0)
            throw new NoSubscribersError(eventType);
        /**
         * Se não, varre a lista de Observer's incritos naquele tipo de evento, passando o dado para todos eles.
         */
        for (let subscriber of this.subscribers[eventType]) {
            subscriber._update({ eventType, data });
        }
    }
}
/**
 * Classe que representa um Observer de instruções.
 */
class InstructionObserver extends Observer {
}
/**
 * Classe que representa um Observable de instruções.
 */
class InstructionObservable extends Observable {
    constructor() {
        super(["slide_left", "slide_right", "slide_up", "slide_down", "single_touch"]);
    }
}
/**
 * Classe que representa o controlador de interface.
 */
class Interface {
    /**
     * @param vector O elemento pelo qual as instruções são recebidas.
     */
    constructor(vector) {
        /**
         * Armazena os estados do toque e deslize sobre o elemento vector.
         */
        this._touchState = {
            touch_start: {
                x: 0,
                y: 0
            },
            touch_last_pos: {
                x: 0,
                y: 0
            },
            touch_moved: false
        };
        /**
         * O Observable que emite repassa as instruções recebidas pelo elemento vector.
         */
        this._instructionObservable = new InstructionObservable();
        /**
         * Uma lista de observers separados por tipo evento.
         */
        this._instructionObservers = {
            "slide_left": new InstructionObserver("slide_left"),
            "slide_right": new InstructionObserver("slide_right"),
            "slide_up": new InstructionObserver("slide_up"),
            "slide_down": new InstructionObserver("slide_down"),
            "single_touch": new InstructionObserver("single_touch"),
        };
        this._vector = vector;
        /**
         * Inscreve todos os Observer's de Instrução criados no Observable de Instrução.
         */
        this._instructionObservable.subscribe("slide_left", this._instructionObservers.slide_left);
        this._instructionObservable.subscribe("slide_right", this._instructionObservers.slide_right);
        this._instructionObservable.subscribe("slide_up", this._instructionObservers.slide_up);
        this._instructionObservable.subscribe("slide_down", this._instructionObservers.slide_down);
        this._instructionObservable.subscribe("single_touch", this._instructionObservers.single_touch);
        /**
         * Adiciona os ouvintes de evento ao elemento vetor, para capturar toques e deslizes sobre ele.
         */
        this._vector.addEventListener("touchstart", event => {
            this._touchState.touch_start.x = event.touches[0].clientX;
            this._touchState.touch_start.y = event.touches[0].clientY;
            this._touchState.touch_moved = false;
        });
        this._vector.addEventListener("touchmove", event => {
            this._touchState.touch_last_pos.x = event.touches[0].clientX;
            this._touchState.touch_last_pos.y = event.touches[0].clientY;
            this._touchState.touch_moved = true;
        });
        this._vector.addEventListener("touchend", () => {
            let diferenceX = this._touchState.touch_start.x - this._touchState.touch_last_pos.x;
            let diferenceY = this._touchState.touch_start.y - this._touchState.touch_last_pos.y;
            if (diferenceX > 50 && this._touchState.touch_moved)
                this._instructionObservable.notifyAllSubscribers("slide_left", this._touchState);
            else if (diferenceX < -50 && this._touchState.touch_moved)
                this._instructionObservable.notifyAllSubscribers("slide_right", this._touchState);
            else if (diferenceY > 50 && this._touchState.touch_moved)
                this._instructionObservable.notifyAllSubscribers("slide_up", this._touchState);
            else if (diferenceY < -50 && this._touchState.touch_moved)
                this._instructionObservable.notifyAllSubscribers("slide_down", this._touchState);
            else
                this._instructionObservable.notifyAllSubscribers("single_touch", null);
        });
    }
    /**
     * Adiciona um callback para determinado tipo de evento.
     * @param eventType O tipo do evento.
     * @param callback O callback.
     */
    on(eventType, callback) {
        let observer = this._instructionObservers[eventType];
        observer.setCustomUpdate(callback);
    }
    /**
     * Alias para o método on
     */
    addEventListener(eventType, callback) {
        this.on(eventType, callback);
    }
    /**
     * Remove o callback de determinado tipo de evento.
     */
    removeEventListener(eventType) {
        let observer = this._instructionObservers[eventType];
        observer.unsetCustomUpdate();
    }
}
