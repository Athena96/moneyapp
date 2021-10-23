
import { Event } from "../Base/Event";
import { Category } from "../Base/Category";

export class EventFactory {

    static fromEvent(event: Event) {
        const copyName = event.name.includes('COPY OF') ? event.name : `COPY OF '${event.name}'`;

        // deep copy categories
        let newCategory = null
        if (event.category) {
            newCategory = new Category('1', event.category.name, event.category.value, event.category.type);
        }
        return new Event(new Date().getTime().toString(), copyName, event.date, event.account, newCategory);
    }

}