type EntityTypeWall = 0;
type EntityTypeFloor = 1;
type EntityTypeMarine = 2;
type EntityTypePistol = 3;
type EntityTypeSymbol = 4;
type EntityTypeSpider= 5;
type EntityType = EntityTypeWall
    | EntityTypeFloor
    | EntityTypeMarine
    | EntityTypePistol
    | EntityTypeSymbol
    | EntityTypeSpider;

const ENTITY_TYPE_WALL: EntityTypeWall = 0;
const ENTITY_TYPE_FLOOR: EntityTypeFloor = 1;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 2;
const ENTITY_TYPE_PISTOL: EntityTypePistol = 3;
const ENTITY_TYPE_SYMBOL: EntityTypeSymbol = 4;
const ENTITY_TYPE_SPIDER: EntityTypeSpider = 5;

const ENTITY_NAMES = [
  'wall',
  'floor',
  'marine',
  'pistol',
  'symbol',
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
  health: number,
  power: number,
  armor?: number,
  pendingHealthDelta?: number,
  pendingPowerDelta?: number,
  pendingArmorDelta?: number,
  maxHealth: number,
  maxPower: number,
} & EntityBase;

type OtherEntity = {
  purpose: EntityPurposeSecondary | EntityPurposeUseless | EntityPurposeWeapon;
} & EntityBase;

type Entity = ActorEntity | OtherEntity;

