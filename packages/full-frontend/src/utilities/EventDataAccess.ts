
import { getEvent, listEvents } from '../graphql/queries'
import { GetEventQuery, ListEventsQuery } from "../API";
import { createEvent, deleteEvent, updateEvent } from '../graphql/mutations';
import { Event } from '../model/Base/Event';
import { Category } from '../model/Base/Category';
import { API, graphqlOperation } from 'aws-amplify'


export class EventDataAccess {

  static convertToDDBObject(event: Event, sim: string) {

    const cc = new Category(event.category!.id, event.category!.name, event.category!.value);
    let e: any = new Event(event.id, event.name, event.age, cc, event.type, sim)
    e['simulation'] = sim;
    return e;

  }

  static async paginateEvents() {
    let nxtTkn: string | null | undefined;
    let events: any = []
    do {
      const response = (await API.graphql({
        query: listEvents, variables: { nextToken: nxtTkn }
      })) as { data: ListEventsQuery }

      for (const event of response.data.listEvents!.items!) {
        events.push(event);
      }
      nxtTkn = response.data.listEvents?.nextToken;
    } while (nxtTkn !== null);

    return events;

  }

  // static async fetchEventsForSelectedSim(componentState: any, userSimulation: string) {
  //   const stockCookie = getCookie("AMZN");
  //   if (stockCookie) {
  //     await this.computeEvents(stockCookie.getValue(), selectedSim!, componentState);
  //   } else {
  //     finnhubClient.quote("AMZN", async (error: any, data: any, response: any) => {
  //       if (data && data.c) {
  //         const currentAmazonStockPrice: number = data.c;
  //         setCookie("AMZN", currentAmazonStockPrice.toString());
  //         await this.computeEvents(currentAmazonStockPrice, selectedSim!, componentState);
  //       }
  //     });
  //   }
  // }

  static async fetchEventsForSelectedSim(selectedSimulationId: string): Promise<Event[]> {
    let fetchedEvents: Event[] = [];
    try {
      const response = await EventDataAccess.paginateEvents();
      for (const event of response) {
        if (event?.simulation && event?.simulation! === selectedSimulationId) {

          let value = 0.0;
          let name = event!.name!;
          if (event!.category && event?.category.value) {
            value = event?.category!.value!;
          }

          const e = new Event(
            event!.id!, 
            name, 
            event!.age!, 
            new Category(event.category!.id!, event!.category!.name!, value), 
            event!.type!, selectedSimulationId);

          fetchedEvents.push(e);

        }
      }
    } catch (error) {
      console.error(error);
    }

    return fetchedEvents;
  }

  static async fetchAllEvents() {
    let fetchedEvents: any = [];
    try {
      const response = await EventDataAccess.paginateEvents();
      for (const event of response) {
        fetchedEvents.push(event);
      }

    } catch (error) {
      console.error(error);
    }
    return fetchedEvents;
  }


  static async createEvent(event: Event) {
    try {
      await API.graphql(graphqlOperation(createEvent, { input: event }))
    } catch (err) {
      console.error('error creating event:', err)
    }
  }


  static async updateEvent(event: Event) {
    try {
      await API.graphql(graphqlOperation(updateEvent, { input: event }))
    } catch (err) {
      console.error('error updating event:', err)
    }
  }

  static async createEventBranch(event: any) {
    try {
      await API.graphql(graphqlOperation(createEvent, { input: event }))
    } catch (err) {
      console.error('error creating event:', err)

    }
  }

  static async deleteEvent(eventIdToDelete: string) {
    try {
      await API.graphql(graphqlOperation(deleteEvent, { input: {
        'id': eventIdToDelete
      } }))
    } catch (err) {
      console.error('error creating event:', err)
    }
  }


  static async getEvent(eventId: string) {

    try {
      const eventResponse = await API.graphql({ query: getEvent, variables: { id: eventId } }) as { data: GetEventQuery }
      const ddbEvent = eventResponse.data!.getEvent!;

      const event = new Event(
        ddbEvent!.id!, 
        ddbEvent!.name!, 
        ddbEvent!.age!, 
        new Category(ddbEvent.category!.id!, ddbEvent!.category!.name!, ddbEvent!.category!.value!), 
        ddbEvent!.type!, ddbEvent!.simulation!);
      return event;
    } catch (err) {
      console.error('error:', err)
    }

  }
}
