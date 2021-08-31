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
  cameraPosition?: Vector3;
  cameraZRotation?: number;
  cameraAnimationQueue?: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

type PartyMember = {
  position: Vector3,
  zRotation: number,
  entity: Entity,
  weapon?: Entity | Falseish,
  secondary?: Entity | Falseish,
  animationQueue: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

const getTargetPositionAndRotations = (party: Party, memberSlot: number) => {
  const tile = party.tile;
  const partyMember = party.members[memberSlot] as PartyMember;
  const ox = (.5 - (memberSlot / 2 | 0))/2;
  const oy = (.5 - (memberSlot % 2))/2;
  let toAngle = party.orientation * Math.PI/2;
  // find the minimum turning angle for toAngle
  const [dx, dy] = vector2Rotate(toAngle, [ox, oy]);
  const targetPosition: Vector3 = [tile[0] + dx, tile[1] + dy, tile[2]];
  let walkAngle = Math.atan2(targetPosition[1] - partyMember.position[1], targetPosition[0] - partyMember.position[0]);
  while (walkAngle > partyMember.zRotation + Math.PI) {
    walkAngle -= Math.PI*2;
  }
  while (walkAngle < partyMember.zRotation - Math.PI) {
    walkAngle += Math.PI*2;
  }
  while (toAngle > walkAngle + Math.PI) {
    toAngle -= Math.PI*2;
  }
  while (toAngle < walkAngle - Math.PI) {
    toAngle += Math.PI*2;
  }

  return [targetPosition, walkAngle, toAngle] as const;
}