"use client";

import { useSelf } from "@liveblocks/react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useCallback, useState } from "react";

import {
  Camera,
  CanvasMode,
  CanvasState,
  Color
} from "@/types/canvas";

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useStorage
} from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";

const MAX_LAYERS = 200;

interface CanvasProps {
  boardId: string,
}

export const Canvas = ({
  boardId
}: CanvasProps) => {

  // const info = useSelf((me) => me.info);
  // console.log(info);

  const layerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>(
    { x: 0, y: 0 }
  );

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onWheel = useCallback((e: React.WheelEvent) => {
    console.log({
      x: e.deltaX,
      y: e.deltaY,
    });
    console.log("sndlkjsdlk")

    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY
    }))
  }, []);

  const onPointerMove = useMutation((
    { setMyPresence },
    e: React.PointerEvent
  ) => {
    e.preventDefault();

    const current = pointerEventToCanvasPoint(e, camera);

    setMyPresence({ cursor: current });
  }, [])

  const onPointerLeave = useMutation((
    { setMyPresence }
  ) => {
    setMyPresence({ cursor: null });
  }, []);

  return (
    <main
      className="h-full w-full relative bg-neutral-200 touch none"
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanavasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />

      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}