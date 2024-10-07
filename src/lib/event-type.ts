import type {PlayerInfo} from "$lib/types";

export interface RecieveEventBasePayload {
    gameRoomId: string;
    username: string;
    playerId: string;
}

// out
export interface PlayerJoinedPayload {
    player: PlayerInfo;
}

// out
export interface PlayerLeftPayload {
    username: string;
    removed: boolean;
}

export interface JoinedSuccessfullyPayload {
    token: string;
}

// in
export type GetScenarioPayload = RecieveEventBasePayload;

export interface SelectSuspectPayload {
    gameRoomId: string;
    username: string;
    suspectId: string;
}

export interface SetReadyPayload {
    gameRoomId: string;
    username: string;
    isReady: boolean;
}

export interface StartGamePayload {
    gameRoomId: string;
    username: string;
}
