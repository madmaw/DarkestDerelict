// virtual types (use other resources to render)
type EntityTypeCeiling = -1;
const ENTITY_TYPE_CEILING: EntityTypeCeiling = -1;
type EntityTypeWallInset = 0;
const ENTITY_TYPE_WALL_INSET: EntityTypeWallInset = 0;
type EntityTypeWallPipes = 1;
const ENTITY_TYPE_WALL_PIPES: EntityTypeWallPipes = 1;
type EntityTypeFloor = 2;
const ENTITY_TYPE_FLOOR: EntityTypeFloor = 2;
type EntityTypeSymbol = 3;
const ENTITY_TYPE_SYMBOL: EntityTypeSymbol = 3;
type EntityTypeResource = 4;
const ENTITY_TYPE_RESOURCE: EntityTypeResource = 4;
type EntityTypeMarine = 5;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 5;
type EntityTypePistol = 6;
const ENTITY_TYPE_PISTOL: EntityTypePistol = 6;
type EntityTypeSpider= 7;
const ENTITY_TYPE_SPIDER: EntityTypeSpider = 7;
type EntityTypeTorch = 8;
const ENTITY_TYPE_TORCH: EntityTypeTorch = 8;
type EntityTypeBattery = 9;
const ENTITY_TYPE_BATTERY: EntityTypeBattery = 9;
type EntityTypeBayonet = 10;
const ENTITY_TYPE_BAYONET: EntityTypeBayonet = 10;
type EntityTypeDoor = 11;
const ENTITY_TYPE_DOOR: EntityTypeDoor = 11;
type EntityTypeKey = 12;
const ENTITY_TYPE_KEY: EntityTypeKey = 12;

type EntityType = EntityTypeCeiling
    | EntityTypeWallInset
    | EntityTypeWallPipes
    | EntityTypeFloor
    | EntityTypeSymbol
    | EntityTypeResource
    | EntityTypeMarine
    | EntityTypePistol
    | EntityTypeSpider
    | EntityTypeTorch
    | EntityTypeBattery
    | EntityTypeBayonet
    | EntityTypeDoor
    | EntityTypeKey;


const ENTITY_NAMES = [
  'wall inset',
  'wall pipes',
  'floor',
  'symbol',
  'resource',
  'marine',
  'pistol',
  'spider',  
  'torch',
  'battery',
  'bayonet',
  'door',
  'key',
];

type EntityPurposeUseless = 0;
const ENTITY_PURPOSE_USELESS: EntityPurposeUseless = 0;
type EntityPurposeWeapon = 1;
const ENTITY_PURPOSE_WEAPON: EntityPurposeWeapon = 1;
type EntityPurposeSecondary = 2;
const ENTITY_PURPOSE_SECONDARY: EntityPurposeSecondary = 2;
type EntityPurposeActor = 3;
const ENTITY_PURPOSE_ACTOR: EntityPurposeActor = 3;
type EntityPurposeDoor = 4;
const ENTITY_PURPOSE_DOOR: EntityPurposeDoor = 4;
type EntityPurpose = EntityPurposeUseless
    | EntityPurposeWeapon
    | EntityPurposeSecondary
    | EntityPurposeActor
    | EntityPurposeDoor;


type EntityRenderables = {
  depthTexture: WebGLTexture,
  renderTexture: WebGLTexture,
  thumbnail: HTMLCanvasElement | HTMLImageElement,
  statusCanvas: HTMLCanvasElement,
  statusTexture: WebGLTexture,
  vertexPositionBuffer: WebGLBuffer,
  vertexIndexBuffer: WebGLBuffer,
  textureCoordinatesBuffer: WebGLBuffer,
  textureBoundsBuffer: WebGLBuffer,
  surfaceRotationsBuffer: WebGLBuffer,
  bounds: Rect3,
  staticTransform: Matrix4,
};

type EntityBase = {
  entityType: EntityType,
  renderables: EntityRenderables,
};

type ActorEntity = {
  purpose: EntityPurposeActor,
  side: number,
  res: ActorEntityResourceValues[],
} & EntityBase & HasAttack;

type ActorEntityResourceTypeHealth = 0;
const ACTOR_ENTITY_RESOURCE_TYPE_HEALTH = 0;
type ActorEntityResourceTypePower = 1;
const ACTOR_ENTITY_RESOURCE_TYPE_POWER = 1;
type ActorEntityResourceType = ActorEntityResourceTypeHealth | ActorEntityResourceTypePower;

type ActorEntityResourceValues = {
  quantity: number,
  max?: number,
  temporary?: number,  
}

type WeaponEntity = {
  purpose: EntityPurposeWeapon,
} & EntityBase & HasAttack;

type SecondaryEntity = {
  purpose: EntityPurposeSecondary | EntityPurposeDoor,
  variation: number,
} & EntityBase;

type OtherEntity = {
  purpose: EntityPurposeUseless,
  variation?: number,
} & EntityBase;

type Entity = ActorEntity | WeaponEntity | SecondaryEntity | OtherEntity;

type HasAttack = {
  // dimensions:
  // 1. power level
  // 2. attacker row (1-2)
  // 3. target position (1-4 - own team, 5-8 - opponent team)
  // 4. effects
  attacks: Attack[][][][];
};

type AttackPiercing = 0;
const ATTACK_PIERCING: AttackPiercing = 0;
type AttackBurning = 1;
const ATTACK_BURNING: AttackBurning = 1;
type AttackPoison = 2;
const ATTACK_POISON: AttackPoison = 2;
type AttackCutting = 3;
const ATTACK_CUTTING: AttackCutting = 3;
type AttackBludgeoning = 4;
const ATTACK_BLUDGEONING: AttackBludgeoning = 4;
type AttackHeal = 5;
const ATTACK_HEAL: AttackHeal = 5;
type AttackHealTemporary = 6;
const ATTACK_HEAL_TEMPORARY: AttackHealTemporary = 6;
type AttackMoveLateral = 7;  // horizontal
const ATTACK_MOVE_LATERAL: AttackMoveLateral = 7;
type AttackMoveMedial = 8; // vertical
const ATTACK_MOVE_MEDIAL: AttackMoveMedial = 8;
type AttackPowerDrain = 9;
const ATTACK_POWER_DRAIN: AttackPowerDrain = 9;
type AttackPowerGain = 10;
const ATTACK_POWER_GAIN: AttackPowerGain = 10;
type AttackPowerGainTemporary = 11;
const ATTACK_POWER_GAIN_TEMPORARY: AttackPowerGainTemporary = 11;
type AttackPowerDrainTemporary = 12;
const ATTACK_POWER_DRAIN_TEMPORARY: AttackPowerDrainTemporary = 12;
type AttackWebbing = 13;
const ATTACK_WEBBING: AttackWebbing = 13;

type Attack = AttackPiercing
    | AttackBurning
    | AttackPoison
    | AttackCutting
    | AttackBludgeoning
    | AttackHeal
    | AttackHealTemporary
    | AttackMoveLateral
    | AttackMoveMedial
    | AttackPowerDrain
    | AttackPowerGain
    | AttackPowerGainTemporary
    | AttackPowerDrainTemporary
    | AttackWebbing;

