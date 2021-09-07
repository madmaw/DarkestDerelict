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
const PARTY_TYPE_HOSTILE: PartyTypeHostile = -4;
type PartyTypePlayer = -3;
const PARTY_TYPE_PLAYER: PartyTypePlayer = -3;
type PartyTypeItem = -1;
const PARTY_TYPE_ITEM: PartyTypeItem = -1;
type PartyTypeFloor = 0;
const PARTY_TYPE_FLOOR: PartyTypeFloor = 0;
type PartyTypeDoor = 8;
const PARTY_TYPE_DOOR: PartyTypeDoor = 8;
type PartyTypeObstacle = 9;
const PARTY_TYPE_OBSTACLE: PartyTypeObstacle = 9;

type PartyType = PartyTypePlayer | PartyTypeItem | PartyTypeHostile | PartyTypeFloor | PartyTypeDoor | PartyTypeObstacle;

type Party = {
  members: (PartyMember | Falseish)[],
  orientated?: Orientation,
  tile: Vector2,
  partyType: PartyType,
  // camera position
  ['cpos']?: Vector3;
  // [negated] camera offset 
  ['coff']?: Vector3,
  // camera z rotation
  ['czr']?: number;
  animationQueue: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

type PartyMember = {
  ['pos']?: Vector3,
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
    attackType: Attack,
    ['x']?: number,
    ['y']?: number,
    ['s']: number, // scale
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
    const moveAnimationFactory = createTweenAnimationFactory(member, member, 'pos', targetPosition, easeLinear, 99);  
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
  let targetPosition: Vector3 | Falseish = [...tile, 0];
  switch (party.partyType) {
    case PARTY_TYPE_HOSTILE:
    case PARTY_TYPE_PLAYER:
      toAngle = party.orientated * CONST_PI_ON_2_1DP;
      const ox = (.5 - (memberSlot / 2 | 0))/2;
      const oy = (.5 - (memberSlot % 2))/2;
      // find the minimum turning angle for toAngle
      const [dx, dy] = vector2Rotate(toAngle, [ox, oy]);    
      targetPosition = [tile[0] + dx, tile[1] + dy, 0];
      break;
    case PARTY_TYPE_ITEM:
      // rotate in place
      if (partyMember.entity.purpose == ENTITY_PURPOSE_ACTOR) {
        toAngle = party.orientated * CONST_PI_ON_2_1DP;
      }
      break;
    case PARTY_TYPE_OBSTACLE:
    case PARTY_TYPE_FLOOR:
      if (partyMember.entity.entityType == ENTITY_TYPE_CEILING) {
        targetPosition = [tile[0], tile[1], 1 - FLOOR_DEPTH * 2/WALL_DIMENSION];
      } else {
        targetPosition = [tile[0], tile[1], -FLOOR_DEPTH/WALL_DIMENSION];
      }
      break;
  }

  const sourcePosition = partyMember['pos'] || party.tile;
  const diff = vectorNLength(vectorNSubtract(targetPosition, sourcePosition));
  let walkAngle: number;
  if (!partyMember['pos'] || diff > .01) {
    walkAngle = Mathatan2(targetPosition[1] - sourcePosition[1], targetPosition[0] - sourcePosition[0])
  } else {
    walkAngle = partyMember['zr'] || 0;
    targetPosition = 0;
  }

  while (walkAngle > partyMember['zr'] + CONST_PI_1DP) {
    walkAngle -= CONST_2_PI_1DP;
  }
  while (walkAngle < partyMember['zr'] - CONST_PI_1DP) {
    walkAngle += CONST_2_PI_1DP;
  }
  while (toAngle > walkAngle + CONST_PI_1DP) {
    toAngle -= CONST_2_PI_1DP;
  }
  while (toAngle < walkAngle - CONST_PI_1DP) {
    toAngle += CONST_2_PI_1DP;
  }

  return [targetPosition, toAngle, walkAngle] as const;
}

const applyAttacks = (party: Party, slot: number): [ActorEntityResourceValues[], number] => {
  const partyMember = party.members[slot];
  if (partyMember) {
    const entity = partyMember.entity as ActorEntity;
    const attacks = partyMember.attackAnimations;
    const [resources, newSlot] = attacks.reduce(
        ([resources, slot], { attackType: attack }) => {
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
              const temporary = resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary|| 0;
              if (temporary) {
                resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary--;
              } else {
                resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity--;
              }
              break;
            case ATTACK_POWER_GAIN:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].quantity++;
              break;
            case ATTACK_POWER_GAIN_TEMPORARY:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary = (resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary|| 0) + 1;
              break;
            case ATTACK_POWER_DRAIN_TEMPORARY:
              resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary = (resources[ACTOR_ENTITY_RESOURCE_TYPE_POWER].temporary|| 0) - 1;
              break;
          }
          return [resources, slot];
        },
        [entity.res.map(r => ({...r})), slot], 
    );
    return [
      resources.map(r => {
        r.quantity = Mathmin(Mathmax(0, r.quantity), r.max || r.quantity);
        r.temporary = Mathmin(Mathmax(r.temporary || 0), r.max || r.quantity);
        return r;
      }),
      newSlot,
    ];
  }
};

const isLookingAt = (party: Party, other: Party) => {
  const lookingAtX = party.tile[0] + CARDINAL_XY_DELTAS[party.orientated][0];
  const lookingAtY = party.tile[1] + CARDINAL_XY_DELTAS[party.orientated][1];
  return lookingAtX == other.tile[0] && lookingAtY == other.tile[1];
}