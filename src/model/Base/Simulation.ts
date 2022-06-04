
import { MonteCarloRowData } from "../../utilities/helpers";
import { Key } from "../Interfaces/KeyInterface";
import { Event } from './Event';
import { Category } from './Category';
import { SimulationStatus } from "../../API";

export class Simulation implements Key {
    id: string;
    name: string;
    selected: number;
    simulationData: string;
    successPercent: string;
    lastComputed: Date;
    user: string;
    status: SimulationStatus;

    constructor(id: string, name: string, selected: number, simulationData: string, successPercent: string, lastComputed: Date, user: string, status: SimulationStatus) {
        this.id = id;
        this.name = name;
        this.selected = selected;
        this.simulationData = simulationData;
        this.successPercent = successPercent;
        this.lastComputed = lastComputed;
        this.user = user;
        this.status = status;
    }

    getSimulationData() {
        const jsonData = JSON.parse(this.simulationData);
        let data: MonteCarloRowData[] = [];
        for (const item of jsonData) {
            const year = Number(item.date.split('-')[0]);
            const month = Number(item.date.split('-')[1])-1;
            const utcDate = new Date(year, month, 1);
            let d: MonteCarloRowData = {
                date: utcDate,
                maxBalance: item.maxBalance,
                avgBalance: item.avgBalance,
                assumedAvgBalance: item.assumedAvgBalance,
                minBalance: item.minBalance,
                return: item.return,
                note: item.note,
                accountUsed: item.accountUsed,
                assumedAvgBalanceBrok: item.assumedAvgBalanceBrok,
                assumedAvgBalanceTax: item.assumedAvgBalanceTax,
                incomeExpenses: item.incomeExpenses
            }

            if (item.events) {
                d.events = [];
                for (const event of item.events!) {
                    d.events.push(new Event(event.id, event.name, event.date, event.account, new Category(event.category.id, event.category.name, event.category.value), event.type))
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

