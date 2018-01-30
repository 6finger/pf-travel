import { DealType, SearchModeType } from "../types";
import { getDealPrice, getDealTime } from './format';

import * as Graph from "node-dijkstra";

export function findTrip(deals: DealType[], from: string, to: string, searchMode: SearchModeType) {
  console.log('trying to get path >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  
  var graphMap: { [key: string]: { [key: string]: number } } = {};
  var dealsMap: { [key: string]: { [key: string]: DealType } } = {};
  
  deals.forEach((deal: DealType) => {
    graphMap[deal.departure] = graphMap[deal.departure] || {};
    dealsMap[deal.departure] = dealsMap[deal.departure] || {};

    let weight = searchMode === SearchModeType.Price ? getDealPrice(deal) : getDealTime(deal);
    let currentWeight = graphMap[deal.departure][deal.arrival];
    if (currentWeight == null || weight < currentWeight) {
      graphMap[deal.departure][deal.arrival] = weight;
      dealsMap[deal.departure][deal.arrival] = deal;
    }
  });
  
  let g = new Graph(graphMap);
  let path = g.shortestPath(from, to);
  
  if (!path || !path.length) {
    return [];
  }
  
  let results: DealType[] = [];
  path.forEach((city: string, index: number) => {
    if (index !== path.length - 1) {
      results.push(dealsMap[city][path[index+1]]);
    }
  });
  return results;
}
