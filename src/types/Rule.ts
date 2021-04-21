interface InstanceRule {}

export interface Rule {
  new (): InstanceRule;
  tag?: string;
  createAcceptor(tag?: any): Acceptor | null;
}

export interface Acceptor {
  strOffset: number;
  isFinal: boolean;
  transit: (ch: any) => any;
  isError: boolean;
  tag: string;
  type: string;
  w: number;
}
