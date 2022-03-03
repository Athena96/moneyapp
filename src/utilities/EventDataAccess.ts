
import { listEvents } from '../graphql/queries'
import { ListEventsQuery } from "../API";
import { createEvent } from '../graphql/mutations';
import { Event } from '../model/Base/Event';

import { Category } from '../model/Base/Category';

import { Simulation } from '../model/Base/Simulation';

import { API, graphqlOperation } from 'aws-amplify'
import { SimulationDataAccess } from './SimulationDataAccess';
import { getCookie, setCookie } from './CookiesHelper';


export class EventDataAccess {

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

  static async fetchEvents(componentState: any, simulations: Simulation[], finnhubClient: any) {

    const selectedSim = SimulationDataAccess.getSelectedSimulation(simulations);
    // const finnhub = require('finnhub');
    // const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    // api_key.apiKey = "c56e8vqad3ibpaik9s20" // Replace this
    // const finnhubClient = new finnhub.DefaultApi()
    
    const stockCookie = getCookie("AMZN");
    if (stockCookie) {
      await this.computeEvents(stockCookie.getValue(), selectedSim!, componentState);
    } else {
      finnhubClient.quote("AMZN", async (error: any, data: any, response: any) => {
        if (data && data.c) {
          const currentAmazonStockPrice: number = data.c;
          setCookie("AMZN", currentAmazonStockPrice.toString());
          await this.computeEvents(currentAmazonStockPrice, selectedSim!, componentState);
        }
      });
    }
  }

  static async fetchDefaultEvents(selectedSimulationId: string): Promise<Event[]> {
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

          const cc = event?.category ? new Category(event.category!.id!, event!.category!.name!, value, event!.category!.type!) : null;
          const e = new Event(event!.id!, name, new Date(event!.date!), event!.account!, cc);

          fetchedEvents.push(e);

        }
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
    return fetchedEvents;
  }

  static async createEventBranch(event: any) {
    try {
      await API.graphql(graphqlOperation(createEvent, { input: event }))
    } catch (err) {
      console.log('error creating event:', err)
    }
  }


  static async computeEvents(currentAmazonStockPrice: number, selectedSim: Simulation, componentState: any) {
    let fetchedEvents: Event[] = [];
    try {
      const response = await EventDataAccess.paginateEvents();
      for (const event of response) {

        if (event?.simulation && event?.simulation! === selectedSim?.id!) {
          let value = 0.0;
          let name = event!.name!;
          if (event!.category && event?.category.value) {
            value = event?.category!.value!;
          }

          // if the event is an AMZN stock RSU vesting, then use todays current stock price for this.
          if (event?.name && event?.name?.includes('amzn')) {
            const parts = event.name.split(' ');
            const quantity = Number(parts[1]);
            name = `earn ${quantity} x amzn stock ${currentAmazonStockPrice}`;
            value = Number((quantity * currentAmazonStockPrice - (0.299 * quantity * currentAmazonStockPrice)).toFixed(2));
          }
          const cc = event?.category ? new Category(event.category!.id!, event!.category!.name!, value, event!.category!.type!) : null;
          const e = new Event(event!.id!, name, new Date(event!.date!), event!.account!, cc);

          fetchedEvents.push(e);
        }
      }
      componentState.setState({ events: fetchedEvents })
    } catch (error) {
      console.log(error);
    }
  }

}
