"use strict";
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
     * Lógica interna de atualização do Observer.
     * @param data - O dado recebido por meio do evento aceito pelo Observer.
     */
    _update(data) {
        if (data.eventType === this.acceptedEventType) {
            if (this.customUpdate)
                this.customUpdate(data);
            else
                throw new Error("Property customUpdate was not defined.");
        }
        else {
            throw new Error(`Unnaccepted eventType (${data.eventType}) for Observer. Accepted eventType (${this.acceptedEventType})`);
        }
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
    }
    /**
     * Increve um observer.
     * @param eventType O tipo do evento em que o Observer será inscrito.
     * @param observer O observer que será inscrito.
     */
    subscribe(eventType, observer) {
        var _a;
        if (this.acceptedEventTypes.includes(eventType)) {
            if (!this.subscribers[eventType]) {
                this.subscribers[eventType] = [];
            }
            (_a = this.subscribers[eventType]) === null || _a === void 0 ? void 0 : _a.push(observer);
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
    unsubscribe(eventType, observer) {
        var _a;
        if (this.acceptedEventTypes.includes(eventType)) {
            if (!this.subscribers[eventType] || ((_a = this.subscribers[eventType]) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                throw new Error(`There are no subscribers for such event type (${eventType}).`);
            }
            for (let subscriber of this.subscribers[eventType]) {
                if (subscriber === observer) {
                    let observerIndex = this.subscribers[eventType].indexOf(subscriber);
                    delete this.subscribers[eventType][observerIndex];
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
    notifyAllSubscribers(eventType, data) {
        var _a;
        if (this.acceptedEventTypes.includes(eventType)) {
            if (!this.subscribers[eventType] || ((_a = this.subscribers[eventType]) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                throw new Error(`There are no subscribers for such event type (${eventType}).`);
            }
            for (let subscriber of this.subscribers[eventType]) {
                subscriber._update({ eventType, data });
            }
        }
        else {
            throw new Error(`Unnaccepted eventType (${eventType}) for Observable. Accepted eventTypes (${this.acceptedEventTypes})`);
        }
    }
}
class InstructionObserver extends Observer {
}
class InstructionObservable extends Observable {
    constructor() {
        super(["slide_left", "slide_right", "slide_up", "slide_down", "single_touch", "double_touch"]);
    }
}
class Interface {
    constructor(vector) {
        this._touchState = { touchstart: { x: null, y: null }, touchlastpos: { x: null, y: null }, touchmoved: null };
        this._internalIntructionObservable = new InstructionObservable();
        this._slideLeftInstructionObserver = new InstructionObserver("slide_left");
        this._slideRightInstructionObserver = new InstructionObserver("slide_right");
        this._slideUpInstructionObserver = new InstructionObserver("slide_up");
        this._slideDownInstructionObserver = new InstructionObserver("slide_down");
        this._singleTouchInstructionObserver = new InstructionObserver("single_touch");
        this._doubleTouchInstructionObserver = new InstructionObserver("double_touch");
        this._internalIntructionObservable.subscribe("slide_left", this._slideLeftInstructionObserver);
        this._internalIntructionObservable.subscribe("slide_right", this._slideRightInstructionObserver);
        this._internalIntructionObservable.subscribe("slide_up", this._slideUpInstructionObserver);
        this._internalIntructionObservable.subscribe("slide_down", this._slideDownInstructionObserver);
        this._internalIntructionObservable.subscribe("single_touch", this._singleTouchInstructionObserver);
        this._internalIntructionObservable.subscribe("double_touch", this._doubleTouchInstructionObserver);
        vector.addEventListener("touchstart", event => {
            this._touchState.touchstart.x = event.touches[0].clientX;
            this._touchState.touchstart.y = event.touches[0].clientY;
            this._touchState.touchmoved = false;
        });
        vector.addEventListener("touchmove", event => {
            this._touchState.touchlastpos.x = event.touches[0].clientX;
            this._touchState.touchlastpos.y = event.touches[0].clientY;
            this._touchState.touchmoved = true;
        });
        vector.addEventListener("touchend", event => {
            let diferenceX = this._touchState.touchstart.x - this._touchState.touchlastpos.x;
            let diferenceY = this._touchState.touchstart.y - this._touchState.touchlastpos.y;
            if (diferenceX > 50 && this._touchState.touchmoved)
                this._internalIntructionObservable.notifyAllSubscribers("slide_left", null);
            else if (diferenceX < -50 && this._touchState.touchmoved)
                this._internalIntructionObservable.notifyAllSubscribers("slide_right", null);
            else if (diferenceY > 50 && this._touchState.touchmoved)
                this._internalIntructionObservable.notifyAllSubscribers("slide_up", null);
            else if (diferenceY < -50 && this._touchState.touchmoved)
                this._internalIntructionObservable.notifyAllSubscribers("slide_down", null);
            else
                this._internalIntructionObservable.notifyAllSubscribers("single_touch", null);
        });
    }
    on(eventType, callback) {
        let observer = this[`_${eventType}InstructionObserver`];
        observer.setCustomUpdate(callback);
    }
}
