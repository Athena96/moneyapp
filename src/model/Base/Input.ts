
import { Key } from "../Interfaces/KeyInterface";

export enum GlidePath {
    Evenly = "Evenly",
    Quickly = "Quickly",
    Slowly = "Slowly",
}
export type Allocations = {
    equities: string,
    bonds: string,
    cash: string,
}

export type AssetAllocation = {
    startAllocations: Allocations | null,
    endAllocations: Allocations | null,
    glidePath: GlidePath | null
}


export type InputSettings = {
    birthday: Date,
    assetAllocation: AssetAllocation,
    firstSignIn: boolean
}

export class Input implements Key {

    id: string;
    settings: InputSettings;
    simulation: string;

    constructor(id: string, settings: string, simulation: string) {
        this.id = id;
        const settingsJSON: any = JSON.parse(settings);
        const assetAllocation: AssetAllocation = {
            startAllocations: {
                equities: '100',
                bonds: '0',
                cash: '0',
            },
            endAllocations: null,
            glidePath: null
        }
        this.settings = {
            birthday: settingsJSON['birthday'] ? new Date(settingsJSON['birthday']) : new Date(),
            assetAllocation: settingsJSON['assetAllocation'] ? settingsJSON['assetAllocation'] : assetAllocation,
            firstSignIn: settingsJSON['firstSignIn'] ? settingsJSON['firstSignIn'] : false
        };
        this.simulation = simulation;
    }

    getKey() {
        return this.id;
    }
}