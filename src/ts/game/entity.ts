// virtual types (use other resources to render)
type EntityTypeCeiling = -1;
const ENTITY_TYPE_CEILING: EntityTypeCeiling = -1;
type EntityTypeWallInset = 0;
const ENTITY_TYPE_WALL_INSET: EntityTypeWallInset = 0;
type EntityTypeWallPipes = 1;
const ENTITY_TYPE_WALL_PIPES: EntityTypeWallPipes = 1;
type EntityTypeFloor = 2;
const ENTITY_TYPE_FLOOR: EntityTypeFloor = 2;
type EntityTypeDoor = 3;
const ENTITY_TYPE_DOOR: EntityTypeDoor = 3;
type EntityTypeSymbol = 4;
const ENTITY_TYPE_SYMBOL: EntityTypeSymbol = 4;
type EntityTypeResource = 5;
const ENTITY_TYPE_RESOURCE: EntityTypeResource = 5;
type EntityTypeMarine = 6;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 6;
type EntityTypeSpider= 7;
const ENTITY_TYPE_SPIDER: EntityTypeSpider = 7;
type EntityTypePistol = 8;
const ENTITY_TYPE_PISTOL: EntityTypePistol = 8;
type EntityTypeShotgun = 9;
const ENTITY_TYPE_SHOTGUN: EntityTypeShotgun = 9;
type EntityTypeFood = 10;
const ENTITY_TYPE_FOOD: EntityTypeFood = 10;
type EntityTypeKey = 11;
const ENTITY_TYPE_KEY: EntityTypeKey = 11;
type EntityTypeBattery = 12;
const ENTITY_TYPE_BATTERY: EntityTypeBattery = 12;
type EntityTypeBayonet = 13;
const ENTITY_TYPE_BAYONET: EntityTypeBayonet = 13;
type EntityTypeTorch = 14;
const ENTITY_TYPE_TORCH: EntityTypeTorch = 14;

type EntityType = EntityTypeCeiling
    | EntityTypeWallInset
    | EntityTypeWallPipes
    | EntityTypeFloor
    | EntityTypeDoor
    | EntityTypeSymbol
    | EntityTypeResource
    | EntityTypeMarine
    | EntityTypeSpider
    | EntityTypePistol
    | EntityTypeShotgun
    | EntityTypeFood
    | EntityTypeKey
    | EntityTypeBattery
    | EntityTypeBayonet
    | EntityTypeTorch
    ;

const ENTITY_NAMES = [
  'wall inset',
  'wall pipes',
  'floor',
  'door',
  'symbol',
  'resource',
  'marine',
  'spider',  
  'pistol',
  'shotgun',
  'food',
  'key',
  'battery',
  'bayonet',
  'torch',
];

const MARINE_VARIATION_RED = 2;
const MARINE_VARIATION_YELLOW = 3;

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
  variation?: number,
} & EntityBase & HasAttack;

type ActorEntityResourceTypeHealth = 0;
const ACTOR_ENTITY_RESOURCE_TYPE_HEALTH = 0;
type ActorEntityResourceTypePower = 1;
const ACTOR_ENTITY_RESOURCE_TYPE_POWER = 1;
type ActorEntityResourceType = ActorEntityResourceTypeHealth | ActorEntityResourceTypePower;

type ActorEntityResourceValues = {
  quantity: number,
  max?: number,
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
type AttackPoison = 1;
const ATTACK_POISON: AttackPoison = 1;
type AttackElectric = 2;
const ATTACK_ELECTRIC: AttackElectric = 2;
type AttackMoveLateral = 3;  // horizontal
const ATTACK_MOVE_LATERAL: AttackMoveLateral = 3;
type AttackMoveMedial = 4; // vertical
const ATTACK_MOVE_MEDIAL: AttackMoveMedial = 4;
type AttackPowerGain = 5;
const ATTACK_POWER_GAIN: AttackPowerGain = 5;
type AttackPowerDrain = 6;
const ATTACK_POWER_DRAIN: AttackPowerDrain = 6;
type AttackWebbing = 7;
const ATTACK_WEBBING: AttackWebbing = 7;

type Attack = AttackPiercing
    | AttackPoison
    | AttackElectric
    | AttackMoveLateral
    | AttackMoveMedial
    | AttackPowerDrain
    | AttackPowerGain
    | AttackWebbing;

