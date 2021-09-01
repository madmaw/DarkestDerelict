type OrientationEast = 0;
type OrientationNorth = 1;
type OrientationWest = 2;
type OrientationSouth = 3;
type Orientation = OrientationEast | OrientationNorth | OrientationWest | OrientationSouth;
const ORIENTATION_EAST: OrientationEast = 0;
const ORIENTATION_NORTH: OrientationNorth = 1;
const ORIENTATION_WEST: OrientationWest = 2;
const ORIENTATION_SOUTH: OrientationSouth = 3;

type PartyTypePlayer = 0;
type PartyTypeHostile = 1;
type PartyTypeItem = 2;
type PartyTypeFloor = 3;
type PartyTypeObstacle = 9;
type PartyType = PartyTypePlayer | PartyTypeItem | PartyTypeHostile | PartyTypeFloor | PartyTypeObstacle;
const PARTY_TYPE_PLAYER: PartyTypePlayer = 0;
const PARTY_TYPE_HOSTILE: PartyTypeHostile = 1;
const PARTY_TYPE_ITEM: PartyTypeItem = 2;
const PARTY_TYPE_FLOOR: PartyTypeFloor = 3;
const PARTY_TYPE_OBSTACLE: PartyTypeObstacle = 9;

type Party = {
  members: (PartyMember | Falseish)[],
  orientation?: Orientation,
  tile: Vector3,
  type: PartyType,
  cameraPosition?: Vector3;
  cameraZRotation?: number;
  cameraAnimationQueue?: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

type PartyMember = {
  position?: Vector3,
  zRotation?: number,
  zScale: number,
  entity: Entity,
  weapon?: Entity | Falseish,
  secondary?: Entity | Falseish,
  animationQueue: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

const BASE_PARTY_MEMBER: Pick<PartyMember, 'zRotation' | 'zScale' | 'anims'> = {
  anims: [],
  zScale: 1,
};

const moveNaturallyToTargetPosition = (party: Party, member: PartyMember, toSlot: number) => {
  const [targetPosition, walkAngle, toAngle] = getTargetPositionAndRotations(party, toSlot);
  const turnAnimationFactory1 = createTweenAnimationFactory(member, 'zRotation', walkAngle, easeLinear, 99);
  const moveAnimationFactory = createTweenAnimationFactory(member, 'position', targetPosition, easeLinear, 99);
  const turnAnimationFactory2 = createTweenAnimationFactory(member, 'zRotation', toAngle, easeLinear, 99);  
  return addEvents(member.animationQueue, turnAnimationFactory1, moveAnimationFactory, turnAnimationFactory2);
}

const getTargetPositionAndRotations = (party: Party, memberSlot: number) => {
  const tile = party.tile;
  const partyMember = party.members[memberSlot] as PartyMember;
  let toAngle = party.orientation * Math.PI/2;
  let targetPosition: Vector3;
  switch (party.type) {
    case PARTY_TYPE_HOSTILE:
    case PARTY_TYPE_PLAYER:
      const ox = (.5 - (memberSlot / 2 | 0))/2;
      const oy = (.5 - (memberSlot % 2))/2;
      // find the minimum turning angle for toAngle
      const [dx, dy] = vector2Rotate(toAngle, [ox, oy]);    
      targetPosition = [tile[0] + dx, tile[1] + dy, tile[2]];
      break;
    case PARTY_TYPE_OBSTACLE:
    case PARTY_TYPE_FLOOR:
      targetPosition = [tile[0], tile[1], tile[2] - FLOOR_DEPTH/WALL_DIMENSION];
      break;
    default:
      targetPosition = tile;
  }

  const sourcePosition = partyMember.position || party.tile;
  let walkAngle = Math.atan2(targetPosition[1] - sourcePosition[1], targetPosition[0] - sourcePosition[0]);
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

  return [targetPosition, toAngle, walkAngle] as const;
}
