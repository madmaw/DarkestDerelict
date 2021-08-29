type EntityTypeWall = 0;
type EntityTypeFloor = 1;
type EntityTypeMarine = 2;
type EntityTypePistol = 3;
type EntityTypeSymbol = 4;
type EntityType = EntityTypeWall
    | EntityTypeFloor
    | EntityTypeMarine
    | EntityTypePistol
    | EntityTypeSymbol;

const ENTITY_TYPE_WALL: EntityTypeWall = 0;
const ENTITY_TYPE_FLOOR: EntityTypeFloor = 1;
const ENTITY_TYPE_MARINE: EntityTypeMarine = 2;
const ENTITY_TYPE_PISTOL: EntityTypePistol = 3;
const ENTITY_TYPE_SYMBOL: EntityTypeSymbol = 4;

type EntityPurposeUseless = 0;
type EntityPurposeWeapon = 1;
type EntityPurposeSecondary = 2;
type EntityPurposeCharacter = 3;
type EntityPurpose = EntityPurposeUseless
    | EntityPurposeWeapon
    | EntityPurposeSecondary
    | EntityPurposeCharacter;
const ENTITY_PURPOSE_USELESS: EntityPurposeUseless = 0;
const ENTITY_PURPOSE_WEAPON: EntityPurposeWeapon = 1;
const ENTITY_PURPOSE_SECONDARY: EntityPurposeSecondary = 2;
const ENTITY_PURPOSE_CHARACTER: EntityPurposeCharacter = 3;

const ENTITY_TYPES_TO_PURPOSES: Partial<Record<EntityType, EntityPurpose>> = {
  // [ENTITY_TYPE_WALL]: ENTITY_PURPOSE_USELESS,
  // [ENTITY_TYPE_FLOOR]: ENTITY_PURPOSE_USELESS,
  [ENTITY_TYPE_MARINE]: ENTITY_PURPOSE_CHARACTER,
  [ENTITY_TYPE_PISTOL]: ENTITY_PURPOSE_WEAPON,
  //[ENTITY_TYPE_SYMBOL]: ENTITY_PURPOSE_WEAPON,
}

type EntityRenderables = {
  depthTexture: WebGLTexture,
  renderTexture: WebGLTexture,
  thumbnail: HTMLCanvasElement | HTMLImageElement,  
  vertexPositionBuffer: WebGLBuffer,
  vertexIndexBuffer: WebGLBuffer,
  textureCoordinatesBuffer: WebGLBuffer,
  textureBoundsBuffer: WebGLBuffer,
  surfaceRotationsBuffer: WebGLBuffer,
  bounds: Rect3,
  staticTransform: Matrix4,
};

type EntityAnimation = {
  animationId: number,
  easing: Easing,
  duration: number,
  onComplete: () => void,
}

type Entity = {
  type: EntityType,
  renderables: EntityRenderables,
}