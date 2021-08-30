type OrientationEast = 0;
type OrientationNorth = 1;
type OrientationWest = 2;
type OrientationSouth = 3;
type Orientation = OrientationEast | OrientationNorth | OrientationWest | OrientationSouth;
const ORIENTATION_EAST: OrientationEast = 0;
const ORIENTATION_NORTH: OrientationNorth = 1;
const ORIENTATION_WEST: OrientationWest = 2;
const ORIENTATION_SOUTH: OrientationSouth = 3;

type PartyTypeItem = 0;
type PartyTypeHostile = 1;
type PartyTypePlayer = 2;
type PartyTypeObstacle = 3;
type PartyTypeFloor = 4;
type PartyType = PartyTypeItem | PartyTypeHostile | PartyTypePlayer | PartyTypeObstacle | PartyTypeFloor;
const PARTY_TYPE_ITEM: PartyTypeItem = 0;
const PARTY_TYPE_HOSTILE: PartyTypeHostile = 1;
const PARTY_TYPE_PLAYER: PartyTypePlayer = 2;
const PARTY_TYPE_OBSTACLE: PartyTypeObstacle = 3;
const PARTY_TYPE_FLOOR: PartyTypeFloor = 4;

type Party = {
  members: (PartyMember | Falseish)[],
  orientation: Orientation,
  tile: Vector3,
  type: PartyType,
};

type PartyMember = {
  position: Vector3,
  zRotation: number,
  entity: Entity,
  weapon?: Entity | Falseish,
  secondary?: Entity | Falseish,
  animationQueue: EventQueue<AnimationFactory, void>,
} & AnimationHolder;
