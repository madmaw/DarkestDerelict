type OrientationEast = 0;
type OrientationNorth = 1;
type OrientationWest = 2;
type OrientationSouth = 3;
type Orientation = OrientationEast | OrientationNorth | OrientationWest | OrientationSouth;
const ORIENTATION_EAST: OrientationEast = 0;
const ORIENTATION_NORTH: OrientationNorth = 1;
const ORIENTATION_WEST: OrientationWest = 2;
const ORIENTATION_SOUTH: OrientationSouth = 3;

type PartyTypeHostile = -4;
type PartyTypePlayer = -3;
type PartyTypeItem = -1;
type PartyTypeFloor = 0;
type PartyTypeObstacle = 9;
type PartyType = PartyTypePlayer | PartyTypeItem | PartyTypeHostile | PartyTypeFloor | PartyTypeObstacle;
const PARTY_TYPE_HOSTILE: PartyTypeHostile = -4;
const PARTY_TYPE_PLAYER: PartyTypePlayer = -3;
const PARTY_TYPE_ITEM: PartyTypeItem = -1;
const PARTY_TYPE_FLOOR: PartyTypeFloor = 0;
const PARTY_TYPE_OBSTACLE: PartyTypeObstacle = 9;

type Party = {
  members: (PartyMember | Falseish)[],
  orientation?: Orientation,
  tile: Vector3,
  type: PartyType,
  // camera position
  ['cpos']?: Vector3;
  // [negated] camera offset 
  ['coff']?: Vector3,
  // camera z rotation
  ['czr']?: number;
  animationQueue: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

type PartyMember = {
  position?: Vector3,
  // y-rotation
  ['yr']?: number,
  // z-rotation
  ['zr']?: number,
  // z-rotation for ambient animations
  ['zr2']?: number,
  // z-scale
  ['zs']: number,
   // status display scale
  ['sds']?: number,
  entity: Entity,
  weapon?: WeaponEntity | Falseish,
  secondary?: Entity | Falseish,
  animationQueue: EventQueue<AnimationFactory, void>,
  attackAnimations?: {
    attack: Attack,
    x?: number,
    y?: number,
    scale: number,
  }[],
  activeAttackStartTime?: number,
} & AnimationHolder;

const BASE_PARTY_MEMBER: Pick<PartyMember, 'yr' | 'zr' | 'zs' | 'anims'> = {
  anims: [],
  ['zs']: 1,
};

const moveNaturallyToSlotPosition = (party: Party, member: PartyMember, toSlot: number) => {
  const [targetPosition, toAngle, walkAngle] = getTargetPositionAndRotations(party, toSlot);
  const turnAnimationFactory2 = createTweenAnimationFactory(member, member, 'zr', toAngle, easeLinear, 99);  
  let stepAnimationFactories: AnimationFactory[] = [];
  if (targetPosition) {
    const turnAnimationFactory1 = createTweenAnimationFactory(member, member, 'zr', walkAngle, easeLinear, 99);
    const moveAnimationFactory = createTweenAnimationFactory(member, member, 'position', targetPosition, easeLinear, 99);  
    stepAnimationFactories = [turnAnimationFactory1, moveAnimationFactory];
  }
  if (targetPosition || toAngle != member['zr']) {
    return addEvents(member.animationQueue, ...stepAnimationFactories, turnAnimationFactory2);
  }
}

const getTargetPositionAndRotations = (party: Party, memberSlot: number) => {
  const tile = party.tile;
  const partyMember = party.members[memberSlot] as PartyMember;
  let toAngle = partyMember['zr'] || 0;
  let targetPosition: Vector3 | Falseish = tile;
  switch (party.type) {
    case PARTY_TYPE_HOSTILE:
    case PARTY_TYPE_PLAYER:
      toAngle = party.orientation * Math.PI/2;
      const ox = (.5 - (memberSlot / 2 | 0))/2;
      const oy = (.5 - (memberSlot % 2))/2;
      // find the minimum turning angle for toAngle
      const [dx, dy] = vector2Rotate(toAngle, [ox, oy]);    
      targetPosition = [tile[0] + dx, tile[1] + dy, tile[2]];
      break;
    case PARTY_TYPE_ITEM:
      // rotate in place
      if (partyMember.entity.purpose == ENTITY_PURPOSE_ACTOR) {
        toAngle = party.orientation * Math.PI/2;
      }
      break;
    case PARTY_TYPE_OBSTACLE:
    case PARTY_TYPE_FLOOR:
      targetPosition = [tile[0], tile[1], tile[2] - FLOOR_DEPTH/WALL_DIMENSION];
      break;
  }

  const sourcePosition = partyMember.position || party.tile;
  const diff = vectorNLength(vectorNSubtract(targetPosition, sourcePosition));
  let walkAngle: number;
  if (!partyMember.position || diff > .01) {
    walkAngle = Math.atan2(targetPosition[1] - sourcePosition[1], targetPosition[0] - sourcePosition[0])
  } else {
    walkAngle = partyMember['zr'] || 0;
    targetPosition = 0;
  }

  while (walkAngle > partyMember['zr'] + Math.PI) {
    walkAngle -= Math.PI*2;
  }
  while (walkAngle < partyMember['zr'] - Math.PI) {
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

const applyAttacks = (party: Party, slot: number): [ActorEntityResourceValues[], number] => {
  const partyMember = party.members[slot];
  if (partyMember) {
    const entity = partyMember.entity as ActorEntity;
    const attacks = partyMember.attackAnimations;
    const [resources, newSlot] = attacks.reduce(
        ([resources, slot], { attack }) => {
          switch (attack) {
            case ATTACK_BLUDGEONING:
            case ATTACK_BURNING:
            case ATTACK_CUTTING:
            case ATTACK_PIERCING:
              // TODO poison should damage over time
            case ATTACK_POISON:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity--;
              break;
            case ATTACK_HEAL:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].quantity++;
              break;
            case ATTACK_HEAL_TEMPORARY:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].temporary = (resources[ACTOR_ENTITY_RESOURCE_TYPE_HEALTH].temporary|| 0) + 1;
              break;
            case ATTACK_MOVE_LATERAL:
              slot = slot + 1 - (slot%2)*2;
              break;
            case ATTACK_MOVE_MEDIAL:
              slot = slot + (1 - (slot/2 | 0)*2)*2;
              break;
            case ATTACK_POWER_DRAIN:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity--;
              break;
            case ATTACK_POWER_GAIN:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity++;
              break;
            case ATTACK_POWER_GAIN_TEMPORARY:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary = (resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary|| 0) + 1;
              break;
          }
          return [resources, slot];
        },
        [entity.res.map(r => ({...r})), slot], 
    );
    return [
      resources.map(r => {
        r.quantity = Math.min(Math.max(0, r.quantity), r.max || r.quantity);
        r.temporary = Math.min(r.temporary || 0, r.max || r.quantity);
        return r;
      }),
      newSlot,
    ];
  }
};

const isLookingAt = (party: Party, other: Party) => {
  const lookingAtX = party.tile[0] + CARDINAL_XY_DELTAS[party.orientation][0];
  const lookingAtY = party.tile[1] + CARDINAL_XY_DELTAS[party.orientation][1];
  const lookingAtZ = party.tile[2];
  return lookingAtX == other.tile[0] && lookingAtY == other.tile[1] && lookingAtZ == other.tile[2]
}