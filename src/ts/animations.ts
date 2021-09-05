type EntityAnimation = (time?: number | undefined) => Booleanish;

type AnimationHolder = {
  anims: EntityAnimation[];
};

type TimeHolder = {
  time: number,
};

type AnimationFactory = (startTime: number) => Promise<void>;

const createAnimationEventQueue = (timeHolder: TimeHolder): EventQueue<AnimationFactory, void> => ({
  handler: (animationFactory: AnimationFactory) => {
    return animationFactory(timeHolder.time);
  },
});

const createTweenAnimationFactory = <T, V extends keyof T>(
    a: AnimationHolder,
    t: T,
    propName: V,
    to: T[V],
    easing: Easing,
    duration: number,
    from?: T[V],
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
          from,
          r,
      );
      a.anims.push(anim);
    });
  }; 
}

const createParallelAnimationFactory = (...animationFactories: AnimationFactory[]) => {
  return (startTime): Promise<any> => {
    return Promise.all(animationFactories.map(animationFactory => animationFactory(startTime)));
  }
}

const createTweenEntityAnimation = <T, V extends keyof T>(
    startTime: number,
    t: T,
    propName: V,
    to: T[V],
    easing: Easing,
    duration: number,
    from: T[V] = t[propName],
    onComplete?: () => void,
) => {
  return (time: number | undefined) => {
    let p = time ? (time - startTime)/duration : 1;
    if (p >= 1) {
      onComplete?.();
      p = 1;
    }
    const s = easing(p);
    // interpolate
    let v: T[V] | any;
    if (Array.isArray(from)) {
      // assume array of numbers
      v = (from as any as number[]).map((v, i) => v + ((to as any as number[])[i] - v)*s);
    } else {
      // assume it's a number
      v = (from as any as number) + ((to as any as number) - (from as any as number))*s;
    }
    t[propName] = v;
    return p | 0;
  };
}
