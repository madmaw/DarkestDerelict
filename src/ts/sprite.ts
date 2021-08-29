
const processSpriteCommands = (name: string, i: number, volumeCommands: readonly VolumetricDrawCommand[], params: (NumericValue<ValueRange> | CharValue)[] = []) => {
  const volumeTemplate = convertVolumetricDrawCommands(volumeCommands);
  console.log(`volume for ${name}`, `"${volumeTemplate}"`);
  const paramsString = params.map(numericOrCharValueToBase64).join('');
  console.log('params', i, `"${paramsString}"`);
  return processVolumetricDrawCommandString(volumeTemplate, paramsString).volume;
};
