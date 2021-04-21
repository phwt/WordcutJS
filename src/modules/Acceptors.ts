import { Rule } from '../types/Rule';

class Acceptors {
  creators: Rule[];
  current: any[];
  tag: any;

  constructor() {
    this.creators = [];
    this.current = [];
    this.tag = {};
  }

  reset() {
    this.current = [];
    this.tag = {};
  }

  transit(ch: any) {
    this.creators.forEach(creator => {
      const acceptor = creator.createAcceptor(this.tag);
      if (acceptor) this.current.push(acceptor);
    });

    const _current = [];
    this.tag = {};

    for (let i = 0; i < this.current.length; i++) {
      const _acceptor = this.current[i],
        acceptor = _acceptor.transit(ch);

      if (!acceptor.isError) {
        _current.push(acceptor);
        this.tag[acceptor.tag] = acceptor;
      }
    }
    this.current = _current;
  }

  getFinalAcceptors() {
    return this.current.filter(function(acceptor) {
      return acceptor.isFinal;
    });
  }
}

export default Acceptors;
