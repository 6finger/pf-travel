import * as Fuse from 'fuse.js';

export class FuzzySearch {
  settings = {
    shouldSort: true,
    findAllMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1
  };

  list: string[] = [];

  fuse: Fuse;

  getMatches(list: string[], item: string): string[] {
    if (list && list.length && list !== this.list) {
      this.list = list;
      this.fuse = new Fuse(this.list, this.settings);
    }
    return this.fuse.search<number>(item).map((i: number) => {
      return this.list[i];
    });
  }
}
