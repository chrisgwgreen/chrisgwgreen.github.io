import ReactDOM from 'react-dom';

let EventDispatcher = {

    elements: [],
    windowProperties: {},
    isTicking: false,
    dispatchedEvents: 0,
    docElement: document.documentElement,

    getWindowProperties: function() {

        return EventDispatcher.windowProperties;
    },

    setWindowProperties: function() {

        EventDispatcher.windowProperties = {
            top: (window.pageYOffset || this.docElement.scrollTop) - (this.docElement.clientTop || 0),
            left: (window.pageXOffset || this.docElement.scrollLeft) - (this.docElement.clientLeft || 0),
            width: window.innerWidth,
            height: window.innerHeight
        }
    },

    initialise: function() {

        EventDispatcher.setWindowProperties();

        window.addEventListener('scroll', function(e) {
            EventDispatcher.dispatchScrollEvents(e);
        });

        window.addEventListener('resize', function(e) {
            EventDispatcher.dispatchResizeEvents(e);
        });

    },

    dispatchResizeEvents: function(e) {

        //Recalibrate all elements...
        e = e || {};

        if (!EventDispatcher.isTicking) {

            EventDispatcher.isTicking = true;
            EventDispatcher.dispatchedEvents = 0;

            window.requestAnimationFrame(function() {

                let i = 0;
                let l = EventDispatcher.elements.length;
                let element;
                let boundingBox;

                EventDispatcher.setWindowProperties();

                for (i; i < l; i += 1) {

                    element = EventDispatcher.elements[i];

                    if (typeof element.events.resize === 'function') {

                        boundingBox = element.element.getBoundingClientRect();

                        element.boundingBox = {
                            top: boundingBox.top + EventDispatcher.windowProperties.top,
                            bottom: boundingBox.bottom + EventDispatcher.windowProperties.top,
                            left: boundingBox.left + EventDispatcher.windowProperties.left,
                            right: boundingBox.right + EventDispatcher.windowProperties.left,
                            height: boundingBox.height,
                            width: boundingBox.width
                        };

                        EventDispatcher.dispatchedEvents += 1;

                        e.boundingBox = element.boundingBox;
                        e.windowProperties = EventDispatcher.windowProperties;

                        element.events.resize(e, EventDispatcher.eventComplete); //Is visible. Trigger scroll event...
                    }

                }


                if (EventDispatcher.dispatchedEvents === 0) { //No events dispatched...
                    EventDispatcher.isTicking = false;
                }

            }, null);

        }

    },

    dispatchScrollEvents: function(e) {

        e = e || {};

        if (!EventDispatcher.isTicking) {

            EventDispatcher.isTicking = true;
            EventDispatcher.dispatchedEvents = 0;

            window.requestAnimationFrame(function() {

                let i = 0;
                let l = EventDispatcher.elements.length;
                let element;

                let w = {
                    top: (window.pageYOffset || EventDispatcher.docElement.scrollTop) - (EventDispatcher.docElement.clientTop || 0),
                    left: (window.pageXOffset || EventDispatcher.docElement.scrollLeft) - (EventDispatcher.docElement.clientLeft || 0),
                    width: EventDispatcher.windowProperties.width,
                    height: EventDispatcher.windowProperties.height
                };

                for (i; i < l; i += 1) {

                    element = EventDispatcher.elements[i];

                    if (typeof element.events.scroll === 'function') {

                        if ((w.top + w.height >= element.boundingBox.top && w.top <= element.boundingBox.bottom) &&
                            (w.left + w.width >= element.boundingBox.left && w.left <= element.boundingBox.right)) {

                            EventDispatcher.dispatchedEvents += 1;

                            e.boundingBox = element.boundingBox;
                            e.windowProperties = w;

                            element.events.scroll(e, EventDispatcher.eventComplete); //Is visible. Trigger scroll event...
                        }
                    }
                }

                if (EventDispatcher.dispatchedEvents === 0) { //No events dispatched...
                    EventDispatcher.isTicking = false;
                }

            }, null);

        }
    },

    eventComplete: function() {

        EventDispatcher.dispatchedEvents -= 1;

        if (!EventDispatcher.dispatchedEvents) { //0
            EventDispatcher.isTicking = false;
        }

    },

    add: function(element, events) {

        let boundingBox;

        element = ReactDOM.findDOMNode(element);
        boundingBox = element.getBoundingClientRect();

        boundingBox = {
            top: boundingBox.top + EventDispatcher.windowProperties.top,
            bottom: boundingBox.bottom + EventDispatcher.windowProperties.top,
            left: boundingBox.left + EventDispatcher.windowProperties.left,
            right: boundingBox.right + EventDispatcher.windowProperties.left,
            height: boundingBox.height,
            width: boundingBox.width
        };

        EventDispatcher.elements.push({
            element: element,
            boundingBox: boundingBox,
            events: events
        });

        if (typeof events.registered === 'function') {
            events.registered({
                windowProperties: EventDispatcher.windowProperties,
                boundingBox: boundingBox
            });
        }
    }

};

EventDispatcher.initialise();

module.exports = {

    register: function(element, events) {
        EventDispatcher.add(element, events);
    },

    getWindowProperties: function() {
        return EventDispatcher.getWindowProperties();
    },

    unregister: function() {

    }

};
