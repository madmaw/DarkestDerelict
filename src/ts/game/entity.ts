type EntityTypeWall = 0;
type EntityTypeFloor = 1;
type EntityTypeSymbol = 2;
type EntityTypeResource = 3;
type EntityTypeMarine = 4;
type EntityTypePistol = 5;
type EntityTypeSpider= 6;
type EntityType = EntityTypeWall
    | EntityTypeFloor
    | EntityTypeSymbol
    | EntityTypeResource
    | EntityTypeMarine
    | EntityTypePistol
    | EntityTypeSpider;

const ENTITY_TYPE_WALL: EntityTypeWall = 0;
const ENTITY_TYPE_FLOOR: EntityTypeFloor = 1;
const ENTITY_TYPE_SYMBOL: EntityTypeSymbol = 2;
const ENTITY_TYPE_RESOURCE: EntityTypeResource = 3;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 4;
const ENTITY_TYPE_PISTOL: EntityTypePistol = 5;
const ENTITY_TYPE_SPIDER: EntityTypeSpider = 6;

const ENTITY_NAMES = [
  'wall',
  'floor',
  'symbol',
  'resource',
  'marine',
  'pistol',
  'spider',  
];

const ENTITY_Z_PADDINGS: Partial<{[k in EntityType]: number}> = {
  [ENTITY_TYPE_MARINE]: 8,
  [ENTITY_TYPE_SPIDER]: 8,
}


type EntityPurposeUseless = 0;
type EntityPurposeWeapon = 1;
type EntityPurposeSecondary = 2;
type EntityPurposeActor = 3;
type EntityPurpose = EntityPurposeUseless
    | EntityPurposeWeapon
    | EntityPurposeSecondary
    | EntityPurposeActor;
const ENTITY_PURPOSE_USELESS: EntityPurposeUseless = 0;
const ENTITY_PURPOSE_WEAPON: EntityPurposeWeapon = 1;
const ENTITY_PURPOSE_SECONDARY: EntityPurposeSecondary = 2;
const ENTITY_PURPOSE_ACTOR: EntityPurposeActor = 3;


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
  type: EntityType,
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

type OtherEntity = {
  purpose: EntityPurposeSecondary | EntityPurposeUseless;
} & EntityBase;

type Entity = ActorEntity | WeaponEntity | OtherEntity;

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
type AttackCutting = 1;
const ATTACK_CUTTING: AttackCutting = 1;
type AttackBludgeoning = 2;
const ATTACK_BLUDGEONING: AttackBludgeoning = 2;
type AttackBurning = 3;
const ATTACK_BURNING: AttackBurning = 3;
type AttackPoison = 4;
const ATTACK_POISON: AttackPoison = 4;
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
type AttackWebbing = 12;
const ATTACK_WEBBING: AttackWebbing = 12;

type Attack = AttackPiercing
    | AttackCutting
    | AttackBludgeoning
    | AttackBurning
    | AttackPoison
    | AttackHeal
    | AttackHealTemporary
    | AttackMoveLateral
    | AttackMoveMedial
    | AttackPowerDrain
    | AttackPowerGain
    | AttackPowerGainTemporary
    | AttackWebbing;

