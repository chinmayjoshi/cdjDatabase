import EventEmitter from 'events';

class Publisher extends EventEmitter {
    currentMessageIndex = 0;
    messages = ["Dummymessage"];

    constructor(partitions, topic) {
        super();

        this.partitions = partitions;
        this.topic = topic;
        

    }

    publishMessage(message) {
        this.messages.push(message);
        this.currentMessageIndex++;
        this.emit('message', this.messages[this.currentMessageIndex]);
    } 

}

export default Publisher;

