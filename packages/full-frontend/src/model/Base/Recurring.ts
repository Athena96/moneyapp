import { ChargeType } from "./ChargeType";



export class Recurring {
  scenarioDataId: string;
  type: string;
  id: string;
  title: string;
  startAge: number;
  endAge: number;
  chargeType: ChargeType;
  amount: number;

  constructor(
    scenarioDataId: string = '',
    id: string = '',
    type: string = '',
    title: string = '',
    startAge: number = 0,
    endAge: number = 0,
    chargeType: ChargeType = ChargeType.EXPENSE,
    amount: number = 0.0
  ) {
    this.scenarioDataId = scenarioDataId;
    this.type = type;
    this.id = id;
    this.title = title;
    this.startAge = startAge;
    this.endAge = endAge;
    this.chargeType = chargeType;
    this.amount = amount;
  }

  static fromJson(json: any): Recurring {
    return new Recurring(
      json['scenarioDataId'].toString(),
      json['id'].toString(),
      json['type'].toString(),
      json['title'].toString(),
      parseInt(json['startAge'].toString(), 10),
      parseInt(json['endAge'].toString(), 10),
      json['chargeType'] === "EXPENSE" ? ChargeType.EXPENSE : ChargeType.INCOME,
      parseFloat(json['amount'].toString())
    );
  }

  toString(): string {
    return `Recurring(id: ${this.id}, simulationId: ${this.scenarioDataId}, type: ${this.type}, title: ${this.title}, startAge: ${this.startAge}, endAge: ${this.endAge}, chargeType: ${this.chargeType}, amount: ${this.amount})`;
  }
}
