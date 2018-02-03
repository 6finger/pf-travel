import { DealType, SearchModeType } from "../types";
import { getDealPrice, getDealTime } from './format';

import * as Graph from "node-dijkstra";

export function findTrip(deals: DealType[], from: string, to: string, searchMode: SearchModeType) {
  // An oriented graph with cities as vertices.
  // Edge between two vertices is the best deal between these two cities.
  var graphMap: { [key: string]: { [key: string]: number } } = {};
  // A graph copying the same structure as the weighted graph
  // but containing the deals that were used to create the graph.
  var dealsMap: { [key: string]: { [key: string]: DealType } } = {};
  
  deals.forEach((deal: DealType) => {
    graphMap[deal.departure] = graphMap[deal.departure] || {};
    dealsMap[deal.departure] = dealsMap[deal.departure] || {};

    // There can be multiple links between cities but we are interested only in the one with the smallest weight.
    // We can do that because for any two paths that differ only in one edge,
    // the path using the edge with smaller weight will have smaller weight in total.
    var weight = searchMode === SearchModeType.Price ? getDealPrice(deal) : getDealTime(deal);
    var currentWeight = graphMap[deal.departure][deal.arrival];
    if (currentWeight == null || weight < currentWeight) {
      graphMap[deal.departure][deal.arrival] = weight;
      dealsMap[deal.departure][deal.arrival] = deal;
    }
  });
  
  var g = new Graph(graphMap);
  var path: string[] = g.shortestPath(from, to);
  
  var results: DealType[] = [];
  path && path.forEach((city: string, index: number) => {
    if (index !== path.length - 1) {
      // Get the original deal between two cities.
      results.push(dealsMap[city][path[index+1]]);
    }
  });
  return results;
}
