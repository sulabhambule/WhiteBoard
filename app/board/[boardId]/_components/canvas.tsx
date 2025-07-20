"use client";

import { useSelf } from "@liveblocks/react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useState } from "react";

import {
  CanvasMode,
  CanvasState
} from "@/types/canvas";

import {
  useCanRedo,
  useCanUndo,
  useHistory
} from "@/liveblocks.config";


interface CanvasProps {
  boardId: string,
}

export const Canvas = ({
  boardId
}: CanvasProps) => {

  // const info = useSelf((me) => me.info);
  // console.log(info);

  const [canvasState, setCanavasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <main
      className="h-full w-full relative bg-neutral-200 touch none"
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanavasState={setCanavasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
    </main>
  )
}