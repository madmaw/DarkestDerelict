///<reference path="../hax.ts"/>
const rngFactory = (startingSeed: number) => {
  let seed = startingSeed;
  return () => {
    const x = Mathsin(seed++) * 1e5;
    const r = x - (x | 0);
    return r;
  };
};