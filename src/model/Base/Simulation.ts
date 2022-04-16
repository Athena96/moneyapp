
import { RowData } from "../../utilities/helpers";
import { Key } from "../Interfaces/KeyInterface";

export class Simulation implements Key {

    id: string;
    name: string;
    selected: number;
    simulationData: string;
    lastComputed: Date;

    constructor(id: string, name: string, selected: number, simulationData: string, lastComputed: Date) {
        this.id = id;
        this.name = name;
        this.selected = selected;
        this.simulationData = simulationData;
        this.lastComputed = lastComputed;
    }

    getSimulationData() {
        const jsonData = JSON.parse(this.simulationData);
        let data: RowData[] = [];
        for (const item of jsonData) {
            data.push(item);
        }
        return data;
    }

    getKey() {
        return this.id;
    }

}

