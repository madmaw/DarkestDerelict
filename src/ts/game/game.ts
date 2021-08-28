type GameEventTypeMove = 0;
const GAME_EVENT_TYPE_MOVE: GameEventTypeMove = 0;
type GameEventMove = {
  type: GameEventTypeMove,
};

type EntityLocation = {
  party: Party,
  slot: number,
};

type GameEventTypeChangeLoadout = 1;
const GAME_EVENT_TYPE_CHANGE_LOADOUT: GameEventTypeChangeLoadout = 1;
type GameEventChangeLoadout = {
  party: Party,
  type: GameEventTypeChangeLoadout,
  entity: Entity,
  from: EntityLocation,
  to: EntityLocation,
};

type GameEventType = GameEventTypeMove | GameEventTypeChangeLoadout;
type GameEvent = GameEventMove | GameEventChangeLoadout;



