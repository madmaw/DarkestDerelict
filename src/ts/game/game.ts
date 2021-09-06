type GameEventTypeMove = 0;
const GAME_EVENT_TYPE_MOVE: GameEventTypeMove = 0;
type GameEventMove = {
  eventType: GameEventTypeMove,
  party: Party,
  unrotatedDeltaPosition: Vector3,
};

type EntityLocation = {
  party: Party,
  slot: number,
};

type GameEventTypeTurn = 1;
const GAME_EVENT_TYPE_TURN: GameEventTypeTurn = 1;
type GameEventTurn = {
  eventType: GameEventTypeTurn,
  party: Party,
  deltaOrientation: number,
};

type GameEventTypeChangeLoadout = 2;
const GAME_EVENT_TYPE_CHANGE_LOADOUT: GameEventTypeChangeLoadout = 2;
type GameEventChangeLoadout = {
  eventType: GameEventTypeChangeLoadout,
  entity: Entity,
  from: EntityLocation,
  to: EntityLocation,
};

type GameEventTypeProposeAttack = 3;
const GAME_EVENT_TYPE_PROPOSE_ATTACK: GameEventTypeProposeAttack = 3;
type GameEventProposeAttack = {
  eventType: GameEventTypeProposeAttack,
  attackerLocation: EntityLocation,
};

type GameEventTypeConfirmAttack = 4;
const GAME_EVENT_TYPE_CONFIRM_ATTACK: GameEventTypeConfirmAttack = 4;
type GameEventConfirmAttack = {
  eventType: GameEventTypeConfirmAttack,
  attackerLocation: EntityLocation,
};

type GameEvent = GameEventMove | GameEventTurn | GameEventChangeLoadout | GameEventProposeAttack | GameEventConfirmAttack;

type Light = {
  ['pos']: Vector3,
  light: Vector4,
  lightTransform: Matrix4,
};

type Game = {
  time: number,
  level?: Level,
  pendingMember?: PartyMember | Falseish,
  previousLights?: Light[];
};

