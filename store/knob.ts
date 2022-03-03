export type ColorChannel = "r" | "g" | "b";

export interface KnobState {
  moving: boolean;
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
  xChan: ColorChannel;
  yChan: ColorChannel;
  zChan: ColorChannel;
}

export enum KnobActionType {
  UPDATE_POSITION,
  START_MOVEMENT,
  STOP_MOVEMENT,
  ROTATE_COLOR_MAP,
}

export type KnobAction = {
  type: KnobActionType;
  payload?: Partial<KnobState>;
};

export function knobReducer(state: KnobState, action: KnobAction): KnobState {
  switch (action.type) {
    case KnobActionType.UPDATE_POSITION:
      return { ...state, ...action.payload };
    case KnobActionType.START_MOVEMENT:
      return { ...state, moving: true };
    case KnobActionType.STOP_MOVEMENT:
      return { ...state, moving: false };
    case KnobActionType.ROTATE_COLOR_MAP:
      return {
        ...state,
        xChan: state.yChan,
        yChan: state.zChan,
        zChan: state.xChan,
      };
    default:
      return state;
  }
}
