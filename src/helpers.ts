import { DealType } from './types';

export function getDealPrice(deal: DealType): number {
  return deal.cost * (1 - (deal.discount ? deal.discount / 100 : 0));
}

export function getDealTime(deal: DealType): number {
  return parseFloat(deal.duration.h) * 60 + parseFloat(deal.duration.m);
}

export function minutesToHoursAndMinutes(minutes: number): {h: number, m: number} {
  let hours = Math.floor(minutes / 60)
  return {
    h: hours,
    m: minutes - hours*60
  }
}