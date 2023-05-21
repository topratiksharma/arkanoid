export interface Boundaries {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ControlState {
    up: boolean;
    down: boolean;
    w: boolean;
    s: boolean;
}

export interface SpeedRatio {
    x: number;
    y: number;
}

export interface Position {
    x: number;
    y: number;
}
