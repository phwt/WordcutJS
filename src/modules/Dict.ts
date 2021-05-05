import WordList from '../data';
import { Acceptor, Rule } from '../types/Rule';
import { createPrefixTree } from './PrefixTree';
import { staticImplements } from './Utils';

@staticImplements<Rule>()
export class Dict {
  static dict: string[] = [];
  static LEFT: number = 0;
  static RIGHT: number = 1;
  static tree: any;

  static init() {
    Dict.addWords(WordList);
    Dict.finalizeDict();
  }

  static addWords(words: string[]) {
    Dict.dict.push.apply(Dict.dict, words);
  }

  static finalizeDict() {
    Dict.dict = Dict.sortuniq(Dict.dict);
    Dict.tree = createPrefixTree(Dict.dict.map(w => [w, null]));
  }

  static dictSeek(l: number, r: number, ch: any, strOffset: any, pos: any) {
    var ans = null;
    while (l <= r) {
      var m = Math.floor((l + r) / 2),
        dict_item = Dict.dict[m],
        len = dict_item.length;
      if (len <= strOffset) {
        l = m + 1;
      } else {
        var ch_ = dict_item[strOffset];
        if (ch_ < ch) {
          l = m + 1;
        } else if (ch_ > ch) {
          r = m - 1;
        } else {
          ans = m;
          if (pos == Dict.LEFT) {
            r = m - 1;
          } else {
            l = m + 1;
          }
        }
      }
    }
    return ans;
  }

  static isFinal(acceptor: Acceptor) {
    // @ts-ignore
    return Dict.dict[acceptor.l].length == acceptor.strOffset;
  }

  static createAcceptor() {
    return {
      nodeId: 0,
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: 'DICT',
      w: 1,
      type: 'DICT',
      dict: Dict.dict,
      transit: (ch: any) => {
        return Dict.transit(this, ch);
      },
    };
  }

  static transit(acceptor: any, ch: any) {
    let child = Dict.tree.lookup(acceptor.nodeId, acceptor.strOffset, ch);
    if (child !== null) {
      let [nodeId, isFinal] = child;
      acceptor.nodeId = nodeId;
      acceptor.strOffset++;
      acceptor.isFinal = isFinal;
    } else {
      acceptor.isError = true;
    }
    return acceptor;
  }

  static sortuniq(a: any) {
    return a.sort().filter((item: any, pos: any, arr: any) => {
      return !pos || item != arr[pos - 1];
    });
  }

  static flatten(a: any[]) {
    //[[1,2],[3]] -> [1,2,3]
    return [].concat.apply([], a);
  }
}
