class PathInfoBuilder {
  buildByAcceptors(path: any[], finalAcceptors: any[], i: number) {
    const infos = finalAcceptors.map(acceptor => {
      const p = i - acceptor.strOffset + 1,
        _info = path[p];

      const info = {
        p: p,
        mw: _info.mw + (acceptor.mw === undefined ? 0 : acceptor.mw),
        w: acceptor.w + _info.w,
        unk: (acceptor.unk ? acceptor.unk : 0) + _info.unk,
        type: acceptor.type,
      };

      if (acceptor.type == 'PART') {
        for (let j = p + 1; j <= i; j++) {
          path[j].merge = p;
        }
        // @ts-ignore
        info.merge = p;
      }

      return info;
    });
    return infos.filter(function(info) {
      return info;
    });
  }

  fallback(
    path: any,
    leftBoundary: number,
    text: { [x: string]: string },
    i: string | number
  ) {
    const _info = path[leftBoundary];
    if (text[i].match(/[\u0E48-\u0E4E]/)) {
      if (leftBoundary != 0) leftBoundary = path[leftBoundary].p;
      return {
        p: leftBoundary,
        mw: 0,
        w: 1 + _info.w,
        unk: 1 + _info.unk,
        type: 'UNK',
      };
      /*    } else if(leftBoundary > 0 && path[leftBoundary].type !== "UNK") {
                  leftBoundary = path[leftBoundary].p;
                  return {p: leftBoundary,
                          w: 1 + _info.w,
                          unk: 1 + _info.unk,
                          type: "UNK"};            */
    } else {
      return {
        p: leftBoundary,
        mw: _info.mw,
        w: 1 + _info.w,
        unk: 1 + _info.unk,
        type: 'UNK',
      };
    }
  }

  build(
    path: any[],
    finalAcceptors: any[],
    i: number,
    leftBoundary: number,
    text: any
  ) {
    const basicPathInfos = this.buildByAcceptors(path, finalAcceptors, i);
    if (basicPathInfos.length > 0) {
      return basicPathInfos;
    } else {
      return [this.fallback(path, leftBoundary, text, i)];
    }
  }
}

export default PathInfoBuilder;
