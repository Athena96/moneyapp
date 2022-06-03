
import { Event } from "../Base/Event";
import { Category } from "../Base/Category";

export class EventFactory {

    static fromEvent(event: Event) {
        const copyName = event.name.includes('COPY OF') ? event.name : `COPY OF '${event.name}'`;
        return new Event(
            new Date().getTime().toString(), 
            copyName, 
            event.date, 
            event.account, 
            new Category(event.category.id, event.category.name, event.category.value), 
            event.type);
    }

}