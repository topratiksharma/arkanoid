export interface Boundaries {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ControlState {
    upPressed: boolean;
    downPressed: boolean;
}

export const Controls ={
    UP: 'ArrowUp',
    DOWN : 'ArrowDown',
    W: 'KeyW',
    S: 'KeyS'
}

export interface SpeedRatio {
    x: number;
    y: number;
}

export interface Position {
    x: number;
    y: number;
}
