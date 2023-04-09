import { Key } from "../Interfaces/KeyInterface";
import { AssetAllocation } from "./AssetAllocation";

export class Input implements Key {
  id: string;
  age: number;
  firstSignIn: boolean;
  assetAllocation: AssetAllocation;
  annualAssetReturnPercent: number;
  annualInflationPercent: number;
  simulation: string;

  constructor(
    id: string,
    age: number,
    firstSignIn: boolean,
    assetAllocation: AssetAllocation,
    simulation: string,
    annualAssetReturnPercent: number,
    annualInflationPercent: number
  ) {
    this.id = id;
    this.age = age;
    this.firstSignIn = firstSignIn;
    this.assetAllocation = assetAllocation;
    this.simulation = simulation;
    this.annualAssetReturnPercent = annualAssetReturnPercent;
    this.annualInflationPercent = annualInflationPercent;
  }

  getKey() {
    return this.id;
  }
}
