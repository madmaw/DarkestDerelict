type EntityAnimation = (time: number) => Booleanish;

type AnimationHolder = {
  anims: EntityAnimation[];
};

type TimeHolder = {
  time: number,
};

type AnimationFactory = (startTime: number) => Promise<void>;

const createAnimationEventQueue = (timeHolder: TimeHolder): EventQueue<AnimationFactory, void> => ({
  events: [],
  handler: (animationFactory: AnimationFactory) => {
    return animationFactory(timeHolder.time);
  },
});

const createTweenAnimationFactory = <T extends AnimationHolder, V extends keyof T>(
    t: T,
    propName: V,
    to: T[V],
    easing: Easing,
    duration: number,
): AnimationFactory => {
  return (startTime: number) => {
    return new Promise(r => {
      const anim = createTweenEntityAnimation(
          startTime,
          t,
          propName,
          to,
          easing,
          duration,
          r,
      );
      t.anims.push(anim);
    });
  }; 
}

const createTweenEntityAnimation = <T extends AnimationHolder, V extends keyof T>(
    startTime: number,
    t: T,
    propName: V,
    to: T[V],
    easing: Easing,
    duration: number,
    onComplete?: () => void
) => {
  const from = t[propName];
  return (time: number) => {
    let p = (time - startTime)/duration;
    if (p >= 1) {
      onComplete?.();
      p = 1;
    }
    const s = easing(p);
    // interpolate
    let v: T[V] | any;
    // given the very small number of supported types, we use a hack to see if the value is a
    // number of an array
    // TODO: will this work with CC?
    if ((from as any)+0 == from) {
      // it's a number
      v = (from as any as number) + ((to as any as number) - (from as any as number))*s;
    } else {
      // assume array of numbers
      v = (from as any as number[]).map((v, i) => v + ((to as any as number[])[i] - v)*s);
    }
    t[propName] = v;
    return p | 0;
  };
}
