export const staticImplements = <T>() => {
  return <U extends T>(constructor: U) => {
    // @ts-ignore
    constructor;
  };
};
