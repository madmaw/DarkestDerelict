
// TODO represent params in a nicer/safer way 
const processSpriteCommands = (name: string, volumeCommands: readonly VolumetricDrawCommand[], params: string[]) => {
  const volumeTemplate = convertVolumetricDrawCommands(volumeCommands);
  console.log(`volume for ${name}`, volumeTemplate);
  return processSpriteSequencesString(volumeTemplate, params.join(''));
};

const processSpriteSequencesString = (volumeTemplate: string, params: string):Volume<Voxel> => {
  return processVolumetricDrawCommandString(volumeTemplate, params).volume;
};