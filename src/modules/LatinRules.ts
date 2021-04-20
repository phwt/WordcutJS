class WordRule {
  static createAcceptor(tag: any) {
    if (tag['WORD_RULE']) return null;

    return {
      strOffset: 0,
      isFinal: false,
      transit: function(ch: any) {
        const lch = ch.toLowerCase();
        if (lch >= 'a' && lch <= 'z') {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      },
      isError: false,
      tag: 'WORD_RULE',
      type: 'WORD_RULE',
      w: 1,
    };
  }
}

class NumberRule {
  static createAcceptor(tag: any) {
    if (tag['NUMBER_RULE']) return null;

    return {
      strOffset: 0,
      isFinal: false,
      transit: function(ch: any) {
        if (ch >= '0' && ch <= '9') {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      },
      isError: false,
      tag: 'NUMBER_RULE',
      type: 'NUMBER_RULE',
      w: 1,
    };
  }
}

class SpaceRule {
  static tag = 'SPACE_RULE';

  static createAcceptor(tag: any) {
    if (tag['SPACE_RULE']) return null;

    return {
      strOffset: 0,
      isFinal: false,
      transit: function(ch: any) {
        if (
          ch == ' ' ||
          ch == '\t' ||
          ch == '\r' ||
          ch == '\n' ||
          ch == '\u00A0' ||
          ch == '\u2003' //nbsp and emsp
        ) {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      },
      isError: false,
      tag: SpaceRule.tag,
      w: 1,
      type: 'SPACE_RULE',
    };
  }
}

class SingleSymbolRule {
  static tag = 'SINSYM';
  // @ts-ignore
  static createAcceptor(tag: any) {
    return {
      strOffset: 0,
      isFinal: false,
      transit: function(ch: any) {
        if (this.strOffset == 0 && ch.match(/^[\@\(\)\/\,\-\."`]$/)) {
          this.isFinal = true;
          this.strOffset++;
        } else {
          this.isError = true;
        }
        return this;
      },
      isError: false,
      tag: 'SINSYM',
      w: 1,
      type: 'SINSYM',
    };
  }
}

export default [WordRule, NumberRule, SpaceRule, SingleSymbolRule];
