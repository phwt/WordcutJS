import PathSelector from './modules/PathSelector';
import Acceptors from './modules/Acceptors';
import PathInfoBuilder from './modules/PathInfoBuilder';
import LatinRules from './modules/LatinRules';
import ThaiRules from './modules/ThaiRules';

class WordcutJS {
  acceptors = new Acceptors();
  pathSelector = new PathSelector();
  pathInfoBuilder = new PathInfoBuilder();

  constructor() {
    LatinRules.map(rule => this.acceptors.creators.push(rule));
    ThaiRules.map(rule => this.acceptors.creators.push(rule));
  }

  buildPath(text: string) {
    let path = this.pathSelector.createPath(),
      leftBoundary = 0;
    this.acceptors.reset();
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      this.acceptors.transit(ch);

      const possiblePathInfos = this.pathInfoBuilder.build(
        path,
        this.acceptors.getFinalAcceptors(),
        i,
        leftBoundary,
        text
      );
      const selectedPath = this.pathSelector.selectPath(possiblePathInfos);

      path.push(selectedPath);
      if (selectedPath.type !== 'UNK') {
        leftBoundary = i;
      }
    }
    return path;
  }

  pathToRanges(path: any) {
    let e = path.length - 1;
    const ranges = [];

    while (e > 0) {
      const info = path[e];
      let s = info.p;

      if (info.merge !== undefined && ranges.length > 0) {
        const r = ranges[ranges.length - 1];
        r.s = info.merge;
        s = r.s;
      } else {
        ranges.push({ s: s, e: e });
      }
      e = s;
    }
    return ranges.reverse();
  }

  rangesToText(text: string, ranges: any[], delimiter: any) {
    return ranges
      .map(function(r) {
        return text.substring(r.s, r.e);
      })
      .join(delimiter);
  }

  cut(text: string, delimiter: string = '|') {
    const path = this.buildPath(text),
      ranges = this.pathToRanges(path);
    return this.rangesToText(text, ranges, delimiter);
  }

  cutIntoRanges(text: string, noText: boolean) {
    const path = this.buildPath(text),
      ranges = this.pathToRanges(path);

    if (!noText) {
      ranges.forEach(function(r) {
        // @ts-ignore
        r.text = text.substring(r.s, r.e);
      });
    }
    return ranges;
  }

  cutIntoArray(text: string) {
    const path = this.buildPath(text),
      ranges = this.pathToRanges(path);

    return ranges.map(function(r) {
      return text.substring(r.s, r.e);
    });
  }
}

export default WordcutJS;
