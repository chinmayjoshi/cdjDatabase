import Observer from './Observer.js';

const observer = new Observer();

observer.on('event', () => {
    console.log('Event emitted');
 });

observer.on("new_event", () => {
    console.log("new event emitted");
}
);

observer.func();
