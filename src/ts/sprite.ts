
type SpriteAnimationTween = {
  from: number,
  to: number,
  range: ValueRange,
};

type SpriteAnimationStep = {
  tweens: SpriteAnimationTween[],
  frames: number,
};

type SpriteAnimationSequence = SpriteAnimationStep[];

const processSpriteCommands = (name: string, volumeCommands: readonly VolumetricDrawCommand[], sequences: readonly SpriteAnimationSequence[]) => {

  const volumeTemplate = convertVolumetricDrawCommands(volumeCommands);

  const animationSequencesStrings = sequences
      .map(command => command
          .map(({tweens, frames: increments}) => tweens
              .map(({from, to, range}) => new Array(increments).fill(0)
                  .map((_, i) => literalValueComponentsToBase64(increments ? from + (to - from)*(i+1)/increments : from, range))
                  .join(''),
              ),
          ),
      );
  console.log(`volume for ${name}`, volumeTemplate);
  console.log(`animations for ${name}`, JSON.stringify(animationSequencesStrings));
 
  return processSpriteSequencesString(volumeTemplate, animationSequencesStrings);
};

const processSpriteSequencesString = (volumeTemplate: string, animationSequencesStrings: string[][][]):Volume<Voxel>[][] => {
  return animationSequencesStrings.map(animationSequenceStrings => {
    return animationSequenceStrings.map(animationStepStrings => {
      const params: string[][] = [];
      animationStepStrings.map((animationStep, i) => animationStep.split('').map((v, j) => {
        if (!params[j]) {
          params[j] = [];
        }
        params[j][i] = v;
      }));
      return params.map(params => {
        return processVolumetricDrawCommandString(volumeTemplate, params).volume;
      });
    }).flat();
  });
};