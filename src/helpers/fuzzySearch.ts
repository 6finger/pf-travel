import * as Fuse from 'fuse.js';


var _settings = {
  shouldSort: true,
  findAllMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1
};

var _list: string[] = [];

var _fuse: Fuse;

export function getMatches(list: string[], item: string): string[] {
  if (list && list.length && list !== _list) {
    _list = list;
    _fuse = new Fuse(_list, _settings);
    console.log('new Fuse >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  }
  return _fuse.search<number>(item).map((i: number) => {
    return _list[i];
  });
}