const FLAG_PRODUCTION = false;
const FLAG_PRODUCTION_MINIMAL = true && FLAG_PRODUCTION;

const FLAG_SHOW_GL_ERRORS = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_USE_GL_CONSTANTS = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_LONG_SHADER_NAMES = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_DEBUG_TEXTURES = false;
const FLAG_CHECK_VOLUME_BOUNDS = true; // needed for padding out top of volumes for status display
const FLAG_WARN_VOLUME_BOUNDS = false;
const FLAG_DEBUG_LEVEL_GENERATION = false;
const FLAG_CANVAS_THUMBNAILS = true; // just allround better
const FLAG_FAST_VOLUME_ITERATION = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_USE_VOLUME_COMMANDS = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_NO_WRAP_TEXTURES = true || FLAG_PRODUCTION_MINIMAL; // higher quality display (might have performance implications?)
const FLAG_CONFIGURABLE_QUALITY = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_ROTATING_ITEMS = true && !FLAG_PRODUCTION_MINIMAL;
const FLAG_CENTER_TEXT_VERTICALLY = false || !FLAG_PRODUCTION_MINIMAL;
const FLAG_USE_PACKED_COLORS = false || FLAG_PRODUCTION_MINIMAL;
const FLAG_SQUARE_SIDES = true && !FLAG_PRODUCTION_MINIMAL; // status display is trunchated on sides otherwise
const FLAG_SCREEN_SHAKE = true || !FLAG_PRODUCTION_MINIMAL; // screen shake on damaged
const FLAG_DAMAGE_ANIMATION = true || !FLAG_PRODUCTION_MINIMAL; // rear up on getting damaged
const FLAG_ATTACK_ANIMATION = true || !FLAG_PRODUCTION_MINIMAL; // rear up and attack
const FLAG_DEATH_ANIMATION = true || !FLAG_PRODUCTION_MINIMAL; // die
const FLAG_MOBILE_SUPPORT = true || !FLAG_PRODUCTION_MINIMAL; // touch controls
const FLAG_ROTATE_COLORS = false;


