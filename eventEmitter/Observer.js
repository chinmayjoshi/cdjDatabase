// I am calling this the Observer class but its the observed class.

import {EventEmitter}  from 'node:events';

class Observer extends EventEmitter {
    constructor() {
      super();
      this.emit('event');
      console.log("Done");
    }

    func() {
        this.emit('new_event');
    }
}

export default Observer;
