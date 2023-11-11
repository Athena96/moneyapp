export class Settings {
    readonly scenarioDataId: string;
    readonly type: string;
    readonly birthday: Date;
    readonly annualAssetReturnPercent: number;
    readonly annualInflationPercent: number;
  
    constructor(
      scenarioDataId: string,
      type: string,
      birthday: Date,
      annualAssetReturnPercent: number,
      annualInflationPercent: number
    ) {
      this.scenarioDataId = scenarioDataId;
      this.type = type;
      this.birthday = birthday;
      this.annualAssetReturnPercent = annualAssetReturnPercent;
      this.annualInflationPercent = annualInflationPercent;
    }
  
    static fromJson(json: any): Settings {
      return new Settings(
        json['scenarioDataId'],
        json['type'],
        new Date(parseInt(json['birthday'])),
        parseFloat(json['annualAssetReturnPercent']),
        parseFloat(json['annualInflationPercent'])
      );
    }
  
    toString(): string {
      return `Settings(scenarioDataId: ${this.scenarioDataId}, type: ${this.type}, birthday: ${this.birthday.toISOString()}, annualAssetReturnPercent: ${this.annualAssetReturnPercent}, annualInflationPercent: ${this.annualInflationPercent})`;
    }
  }
  