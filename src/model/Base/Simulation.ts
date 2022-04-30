
import { MonteCarloRowData } from "../../utilities/helpers";
import { Key } from "../Interfaces/KeyInterface";
import { Event } from './Event';
import { Category } from './Category';

export class Simulation implements Key {

    id: string;
    name: string;
    selected: number;
    simulationData: string;
    successPercent: string;
    lastComputed: Date;
    user: string;

    constructor(id: string, name: string, selected: number, simulationData: string, successPercent: string, lastComputed: Date, user: string) {
        this.id = id;
        this.name = name;
        this.selected = selected;
        this.simulationData = simulationData;
        this.successPercent = successPercent;
        this.lastComputed = lastComputed;
        this.user = user;
    }

    getSimulationData() {
        const jsonData = JSON.parse(this.simulationData);
        let data: MonteCarloRowData[] = [];
        for (const item of jsonData) {

            let d: MonteCarloRowData = {
                date: item.date,
                maxBalance: item.maxBalance,
                avgBalance: item.avgBalance,
                assumedAvgBalance: item.assumedAvgBalance,
                minBalance: item.minBalance,
                return: item.return,
                note: item.note,
                accountUsed: item.accountUsed,
            }

            if (item.events) {
                d.events = [];
                for (const event of item.events!) {
                    d.events.push(new Event(event.id, event.name, event.date, event.account, new Category(event.category.id, event.category.name, event.category.value, event.category.type)))
                }
            }

            data.push(d);
        }

        return data;
    }

    getKey() {
        return this.id;
    }

}

