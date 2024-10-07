/***************************/
/********** NODES **********/
/***************************/


export type GameRoomNode = {
    id: string;
    status: 'waiting' | 'ongoing' | 'finished';
    scenarioName: string;
    name: string;
    createdAt: Date;
    lastTurnTimestamp: Date;
};

export type PlayerNode = {
    id: string;
    username: string;
    token: string;
    online: boolean;
    ready: boolean;
    numberOfMoveLeft: number; // Si -1, le joueur n'a pas encore lancer les dés
};

export type SuspectNode = {
    id: string;
    name: string;
    color: string;
    position: Position;
};

export type WeaponNode = {
    id: string;
    name: string;
};

export type RoomNode = {
    id: string;
    name: string;
    color: string;
};

export type AssumptionNode = {
    id: string;
    type: 'hypothesis' | 'accusation';
    timestamp: Date;
};

export type ScenarioSuspect = {
    name: string;
    color: string;
};



export type Position = [number, number];

export type PlayerInfo = {
    id: string;
    username: string;
    online: boolean;
    ready: boolean;
    isHost: boolean;
    playAs: ScenarioSuspect | null;
    isEliminated: boolean;
    needToDisprove: boolean;
    numberOfMoveLeft: number;
};

export type InstanciatedScenario = {
    name: string;
    mapImage: string;
    rooms: RoomNode[];
    suspects: SuspectNode[];
    weapons: WeaponNode[];
    mapCells: MapCell[][];
};

export type Card = {
    id: string;
    name: string;
    type: 'suspect' | 'weapon' | 'room';
};

export interface MapCell {
    position: Position;
    color: string;
    cellType: 'empty' | 'room' | 'door' | 'wall';
    roomName: string | null;
    isDoor: boolean;
}

export interface AssumptionInfo {
    id: string;
    type: 'hypothesis' | 'accusation';
    playerId: string;
    suspectId: string;
    weaponId: string;
    roomId: string;
    timestamp: number;
    disproved?: boolean;
    disproverPlayerId?: string;
    disproveCardId?: string;
}
