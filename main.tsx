import React, {
  MouseEventHandler,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { render } from "react-dom";
import { useWindowSize } from "./hooks/useWindowSize";
import { KnobActionType, knobReducer } from "./store/knob";

function Main() {
  let windowSize = useWindowSize();

  let widthPer100 = useMemo(() => windowSize.width / 100, [windowSize.width]);
  let heightPer100 = useMemo(
    () => windowSize.height / 100,
    [windowSize.height]
  );

  let widthPer255 = useMemo(() => windowSize.width / 255, [windowSize.width]);
  let heightPer255 = useMemo(
    () => windowSize.height / 255,
    [windowSize.height]
  );

  let [knob1, dispatch1] = useReducer(knobReducer, {
    r: 0,
    g: 0,
    b: 0,
    xChan: "r",
    yChan: "g",
    zChan: "b",
    x: windowSize.width * 0.25,
    y: windowSize.height * 0.25,
    moving: false,
  });
  let [knob2, dispatch2] = useReducer(knobReducer, {
    r: 0,
    g: 0,
    b: 0,
    xChan: "r",
    yChan: "g",
    zChan: "b",
    x: windowSize.width * 0.75,
    y: windowSize.height * 0.75,
    moving: false,
  });

  let lineCoords = useMemo(() => {
    let { x: x1, y: y1 } = knob1;
    let { x: x2, y: y2 } = knob2;
    return { x1, y1, x2, y2 };
  }, [knob1, knob2]);

  let stopsCoords = useMemo(() => {
    let { x: cx1, y: cy1 } = knob1;
    let { x: cx2, y: cy2 } = knob2;
    let x1 = cx1 / widthPer100 + "%";
    let y1 = cy1 / heightPer100 + "%";
    let x2 = cx2 / widthPer100 + "%";
    let y2 = cy2 / heightPer100 + "%";
    return { x1, y1, x2, y2 };
  }, [knob1, knob2, widthPer100, heightPer100]);

  let stop1Color = useMemo(() => {
    let { x, y, xChan, yChan, zChan } = knob1;
    let color = {
      [xChan]: x / widthPer255,
      [yChan]: y / heightPer255,
      [zChan]: Math.sqrt(x ** 2 + y ** 2),
    };
    return `rgb(${color["r"]},${color["g"]},${color["b"]})`;
  }, [knob1, widthPer255, heightPer255]);

  let stop2Color = useMemo(() => {
    let { x, y, xChan, yChan, zChan } = knob2;
    let color = {
      [xChan]: x / widthPer255,
      [yChan]: y / heightPer255,
      [zChan]: Math.sqrt(x ** 2 + y ** 2),
    };
    return `rgb(${color["r"]},${color["g"]},${color["b"]})`;
  }, [knob2, widthPer255, heightPer255]);

  let rotateKnob1 = useCallback(() => {
    dispatch1({ type: KnobActionType.ROTATE_COLOR_MAP });
  }, [dispatch1]);
  let rotateKnob2 = useCallback(() => {
    dispatch2({ type: KnobActionType.ROTATE_COLOR_MAP });
  }, [dispatch2]);

  let startKnob1Movement = useCallback(() => {
    dispatch1({ type: KnobActionType.START_MOVEMENT });
  }, [dispatch1]);
  let startKnob2Movement = useCallback(() => {
    dispatch2({ type: KnobActionType.START_MOVEMENT });
  }, [dispatch2]);

  let stopKnob1Movement = useCallback(() => {
    dispatch1({ type: KnobActionType.STOP_MOVEMENT });
  }, [dispatch1]);
  let stopKnob2Movement = useCallback(() => {
    dispatch2({ type: KnobActionType.STOP_MOVEMENT });
  }, [dispatch2]);

  let moveKnobs: MouseEventHandler = useCallback(
    ({ clientX: x, clientY: y }) => {
      let type = KnobActionType.UPDATE_POSITION;
      let payload = { x, y };
      if (knob1.moving) dispatch1({ type, payload });
      else if (knob2.moving) dispatch2({ type, payload });
    },
    [knob1, knob2]
  );

  return (
    <svg {...windowSize} onMouseMove={moveKnobs}>
      <defs>
        <linearGradient id="gradient" {...stopsCoords}>
          <stop offset="0%" style={{ stopColor: stop1Color, stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: stop2Color, stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
      <line stroke="black" {...lineCoords} />
      <circle
        r={20}
        cx={knob1.x}
        cy={knob1.y}
        fill="gray"
        stroke="black"
        onDoubleClick={rotateKnob1}
        onMouseDown={startKnob1Movement}
        onMouseUp={stopKnob1Movement}
      />
      <circle
        r={20}
        cx={knob2.x}
        cy={knob2.y}
        fill="gray"
        stroke="black"
        onDoubleClick={rotateKnob2}
        onMouseDown={startKnob2Movement}
        onMouseUp={stopKnob2Movement}
      />
    </svg>
  );
}

render(<Main />, document.getElementById("root"));
