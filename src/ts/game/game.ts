type GameEventTypeMove = 0;
const GAME_EVENT_TYPE_MOVE: GameEventTypeMove = 0;
type GameEventMove = {
  type: GameEventTypeMove,
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
  type: GameEventTypeTurn,
  party: Party,
  deltaOrientation: number,
};

type GameEventTypeChangeLoadout = 2;
const GAME_EVENT_TYPE_CHANGE_LOADOUT: GameEventTypeChangeLoadout = 2;
type GameEventChangeLoadout = {
  party: Party,
  type: GameEventTypeChangeLoadout,
  entity: Entity,
  from: EntityLocation,
  to: EntityLocation,
};

type GameEvent = GameEventMove | GameEventTurn | GameEventChangeLoadout;

type Game = {
  time: number,
  level?: Level,
  cameraPosition: Vector3;
  cameraZRotation: number;
  cameraAnimationQueue?: EventQueue<AnimationFactory, void>,
} & AnimationHolder;

