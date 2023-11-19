export class Asset {
  id: string;
  scenarioDataId: string;
  type: string;
  ticker: string;
  quantity: number;
  price: number;
  hasIndexData: number;

  constructor(
      scenarioDataId: string = '',
      id: string = '',
      type: string = '',
      ticker: string = '',
      quantity: number = 0.0,
      price: number = 0.0,
      hasIndexData: number = 1,
  ) {
    this.scenarioDataId = scenarioDataId;
    this.id = id;
    this.type = type;
    this.ticker = ticker;
    this.quantity = quantity;
    this.price = price;
    this.hasIndexData = hasIndexData;
  }

  static fromJson(json: { [key: string]: any }): Asset {
    return new Asset(
        json.scenarioDataId,
        json.id,
        json.type,
        json.ticker,
        parseFloat(json.quantity),
        parseFloat(json.price),
        parseInt(json.hasIndexData, 10),
    );
  }

  static computeTotalAssetValue(assets: Asset[]): number {
    let total = 0.0;
    for (const asset of assets) {
      if (asset.hasIndexData === 1) {
        total += asset.quantity * asset.price;
      } else {
        total += asset.price;
      }
    }
    return total;
  }

  toString(): string {
    return `Asset(
      id: ${this.id}, 
      simulationId: ${this.scenarioDataId}, 
      type: ${this.type}, 
      ticker: ${this.ticker}, 
      quantity: ${this.quantity}, 
      price: ${this.price}, 
      hasIndexData: ${this.hasIndexData})`;
  }
}
