class Subscriber {

    publisher = null;

    constructor(subscriberId) {
        this.subscriberId = subscriberId;
        this.handleMessage = this.handleMessage.bind(this);
    }

    subscribe(publisher) {
        this.publisher = publisher;
        this.publisher.on('message', this.handleMessage);
    }

    handleMessage(message) {

        console.log("Message received: " + message + " by subscriber: " + this.subscriberId);
        
        
    }

  
        


}

export default Subscriber;