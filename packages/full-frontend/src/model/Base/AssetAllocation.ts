import { GlidePath } from "../../API";
import { Allocations } from "./Allocations";


export class AssetAllocation {
    startAllocations: Allocations
    endAllocations: Allocations | undefined;
    glidePath: GlidePath | undefined;

    constructor(startAllocations: Allocations, endAllocations: Allocations | undefined, glidePath: GlidePath | undefined) {
        this.startAllocations = startAllocations;
        this.endAllocations = endAllocations;
        this.glidePath = glidePath;
    }
}

