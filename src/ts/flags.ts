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
const FLAG_ROTATING_ITEMS = true;
const FLAG_USE_PACKED_COLORS = false || FLAG_PRODUCTION_MINIMAL;
const FLAG_SQUARE_SIDES = true; // status display is trunchated on sides otherwise
const FLAG_SCREEN_SHAKE = true; // screen shake on damaged
const FLAG_DAMAGE_ANIMATION = true; // rear up on getting damaged
const FLAG_ATTACK_ANIMATION = true; // rear up and attack
const FLAG_DEATH_ANIMATION = true; // die
const FLAG_MOBILE_SUPPORT = true; // touch controls
const FLAG_ROTATE_COLORS = false; // doesn't work on iOS
const FLAG_MARINE_DIMORPHISM = true;
const FLAG_DEBUG_SHORTENED_METHODS = false; // print out all the shortened methods
const FLAG_USE_ATTACK_MATRICES = true; // always smaller and easier to maintain
const FLAG_USE_HAND_ROLLED_GLSL_CONSTANTS = false || FLAG_PRODUCTION_MINIMAL;
const FLAG_IGNORE_DRAG_CANCEL = false || FLAG_PRODUCTION_MINIMAL;
const FLAG_TORCH_SCARES_ENEMIES = true;
const FLAG_OFFSET_LOOT = true;
const FLAG_TREASURE_ROOMS = true;
const FLAG_FOOD_IN_TREASURE_ROOMS = true;
const FLAG_SHORTEN_WINDOW = false || FLAG_PRODUCTION_MINIMAL || FLAG_DEBUG_SHORTENED_METHODS;
const FLAG_SHORTEN_DOCUMENT = false;// || FLAG_PRODUCTION_MINIMAL || FLAG_DEBUG_SHORTENED_METHODS; - breaks element creation
const FLAG_INITIAL_DELAY = true; // stops the browser complaining about being frozen
