const FLAG_PRODUCTION = false;
const FLAG_PRODUCTION_MINIMAL = false && FLAG_PRODUCTION;

const FLAG_SHOW_GL_ERRORS = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_USE_GL_CONSTANTS = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_LONG_SHADER_NAMES = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_DEBUG_TEXTURES = false && !FLAG_PRODUCTION;
const FLAG_CHECK_VOLUME_BOUNDS = false || !FLAG_PRODUCTION;