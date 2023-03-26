import Publisher from './publisher.js';
import Subscriber from './subscriber.js';

let init = () => {

    const publisher = new Publisher(1, "testtopic");

    const subscriber1 = new Subscriber(2);
    const subscriber2 = new Subscriber(3);

    subscriber1.subscribe(publisher);
    subscriber2.subscribe(publisher);

    for(var i = 0; i < 100; i++) {
        publisher.publishMessage("Message number : " + i );    
    }

}

init();


