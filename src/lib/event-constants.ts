// game-events.ts

// Types
import type {AssumptionInfo, Card, InstanciatedScenario, MapCell, PlayerInfo} from "$lib/types";

export interface RecieveEventBasePayload {
}

//////////////////////////////////////////////////////////////////////////////////////////////////

export interface PlayerJoinedPayload {
    player: PlayerInfo;
}

export interface PlayerLeftPayload {
    username: string;
    removed: boolean;
}

export interface JoinedSuccessfullyPayload {
    token: string;
}

export interface SelectSuspectPayload extends RecieveEventBasePayload {
    suspectId: string;
}

export interface SetReadyPayload extends RecieveEventBasePayload {
    ready: boolean;
}

export interface InstantiatedScenarioPayload {
    scenario: InstanciatedScenario;
}

export interface PlayersListPayload {
    players: PlayerInfo[];
}

export interface YourCardsPayload {
    cards: Card[];
}

export interface BoardPayload {
    board: MapCell[][];
}

export type SuspectPositionBoard = [number, number];
export type SuspectPositionInRoom = string; // roomName
export type SuspectPosition = SuspectPositionBoard | SuspectPositionInRoom;

export interface SuspectsPositionPayload {
    suspects: { [suspectId: string]: SuspectPosition };
}

export interface DicesResultPayload {
    dices: number[];
}

export interface MoveSuspectPayload extends RecieveEventBasePayload {
    suspectId: string;
    position: SuspectPosition;
}

export interface GameSummupPayload {
    yourCards: Card[];
    suspectsPosition: { [suspectId: string]: SuspectPosition };
    playerOrder: string[];
    playerCurrentTurn: string;
    assumptionToDisprove?: AssumptionInfo;
}

export interface CurrentTurnPayload {
    currentTurn: PlayerInfo;
}

export interface MakeAssumptionPayload extends RecieveEventBasePayload {
    suspectId: string;
    weaponId: string;
    roomId: string;
    type: 'accusation' | 'hypothesis';
}

export interface DisproveHypothesisPayload extends RecieveEventBasePayload {
    assumptionId: string;
    card?: Card;
}

export interface NeedToDisproveAssumptionPayload {
    assumption: AssumptionInfo;
}

export interface AssumptionsListPayload {
    assumptions: AssumptionInfo[];
}

export interface GameWonPayload {
    winnerId: string;
}

// Constants
export const GameEvents = {
    PLAYER_JOINED: 'playerJoined' as const,
    PLAYER_LEFT: 'playerLeft' as const,
    GET_SCENARIO: 'getScenario' as const,
    INSTANTIATED_SCENARIO: 'instantiatedScenario' as const,
    SELECT_SUSPECT: 'selectSuspect' as const,
    SET_READY: 'setReady' as const,
    START_GAME: 'startGame' as const,
    JOINED_SUCCESSFULLY: 'joinedSuccessfully' as const,
    LIST_PLAYERS: 'listPlayers' as const,
    PLAYERS_LIST: 'playersList' as const,
    /////////////////////////////
    GET_SUMMUP: 'getSummup' as const,
    GAME_SUMMUP: 'gameSummup' as const,
    YOUR_CARDS: 'yourCards' as const,
    BOARD: 'board' as const,
    SUSPECTS_POSITION: 'suspectsPosition' as const,
    ITS_YOUR_TURN: 'itsYourTurn' as const,
    THROW_DICES: 'throwDices' as const,
    DICES_RESULT: 'dicesResult' as const,
    MOVE_SUSPECT: 'moveSuspect' as const,
    SHOW_PLATO: 'showPlato' as const,
    END_TURN: 'endTurn' as const,

    GAME_WON: 'gameWon' as const,
    CURRENT_TURN: 'currentTurn' as const,
    MAKE_ASSUPMTION: 'makeAssumption' as const,
    DISPROVE_HYPOTHESIS: 'disproveHypothesis' as const,
    NEED_TO_DISPROVE_ASSUMPTION: 'needToDisproveAssumption' as const,
    GET_ASSUMPTIONS_LIST: 'getAssumptionsList' as const,
    ASSUMPTIONS_LIST: 'assumptionsList' as const,
} as const;

// Event map
export type GameEventMap = {
    [GameEvents.JOINED_SUCCESSFULLY]: JoinedSuccessfullyPayload;
    [GameEvents.PLAYER_JOINED]: PlayerJoinedPayload;
    [GameEvents.PLAYER_LEFT]: PlayerLeftPayload;
    [GameEvents.LIST_PLAYERS]: RecieveEventBasePayload;
    [GameEvents.PLAYERS_LIST]: PlayersListPayload;
    [GameEvents.GET_SCENARIO]: RecieveEventBasePayload;
    [GameEvents.INSTANTIATED_SCENARIO]: InstantiatedScenarioPayload;
    [GameEvents.SELECT_SUSPECT]: SelectSuspectPayload;
    [GameEvents.SET_READY]: SetReadyPayload;
    [GameEvents.START_GAME]: RecieveEventBasePayload;
    /////////////////////////////
    [GameEvents.GET_SUMMUP]: RecieveEventBasePayload;
    [GameEvents.GAME_SUMMUP]: GameSummupPayload;
    [GameEvents.YOUR_CARDS]: YourCardsPayload;
    [GameEvents.BOARD]: BoardPayload;
    [GameEvents.SUSPECTS_POSITION]: SuspectsPositionPayload;
    [GameEvents.ITS_YOUR_TURN]: RecieveEventBasePayload;
    [GameEvents.THROW_DICES]: RecieveEventBasePayload;
    [GameEvents.DICES_RESULT]: DicesResultPayload;
    [GameEvents.MOVE_SUSPECT]: MoveSuspectPayload;
    [GameEvents.SHOW_PLATO]: RecieveEventBasePayload;
    [GameEvents.END_TURN]: RecieveEventBasePayload;
    [GameEvents.CURRENT_TURN]: CurrentTurnPayload;
    [GameEvents.MAKE_ASSUPMTION]: MakeAssumptionPayload;
    [GameEvents.DISPROVE_HYPOTHESIS]: DisproveHypothesisPayload;
    [GameEvents.NEED_TO_DISPROVE_ASSUMPTION]: NeedToDisproveAssumptionPayload;
    [GameEvents.GET_ASSUMPTIONS_LIST]: RecieveEventBasePayload;
    [GameEvents.ASSUMPTIONS_LIST]: AssumptionsListPayload;
    [GameEvents.GAME_WON]: GameWonPayload;
};

