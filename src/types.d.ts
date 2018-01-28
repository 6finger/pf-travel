export enum TransportType {
  Train = "train",
  Bus = "bus",
  Car = "car"
}

export type DealType = {
  "transport": TransportType;
  "departure": string;
  "arrival": string;
  "duration": {
    "h": string,
    "m": string
  };
  "cost": number;
  "discount": number;
  "reference": string;
}

export type ResponseType = {
  currency: string;
  deals: DealType[];
}