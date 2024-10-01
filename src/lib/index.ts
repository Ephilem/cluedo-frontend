// place files you want to import through the `$lib` alias in this folder.

export interface Room {
    id: string;
    color: string;
    secretPassages?: string[];
}

export interface Suspect {
    id: string;
    name: string;
    color: string;
}

export interface Weapon {
    id: string;
    name: string;
}

export interface Scenario {
    name: string;
    mapImage: string;
    rooms: {
        [roomName: string]: Room;
    };
    suspects: Suspect[];
    weapons: Weapon[];
}

