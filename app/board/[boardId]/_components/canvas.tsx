"use client";

import { useSelf } from "@liveblocks/react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";

import { Path } from "./path";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { CursorPresence } from "./cursors-presence";
import { LiveObject } from "@liveblocks/client";
import { SelectionTools } from "./selection-tools";

import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH
} from "@/types/canvas";

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage
} from "@/liveblocks.config";

import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint,
  resizeBounds
} from "@/lib/utils";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

const MAX_LAYERS = 200;
const ERASE_RADIUS = 10;

interface CanvasProps {
  boardId: string,
}

function findLayerAtPoint(
  layers: Map<string, LiveObject<any>>,
  layerIds: string[],
  point: Point
): string | null {
  for (const id of layerIds) {
    const layer = layers.get(id);
    if (!layer) continue;

    const type = layer.get("type") as LayerType;
    const x = layer.get("x") as number;
    const y = layer.get("y") as number;
    const width = layer.get("width") as number;
    const height = layer.get("height") as number;

    // Simple bounding box hit test with some padding for eraser radius
    if (
      point.x >= x - ERASE_RADIUS &&
      point.x <= x + width + ERASE_RADIUS &&
      point.y >= y - ERASE_RADIUS &&
      point.y <= y + height + ERASE_RADIUS
    ) {
      return id;
    }
  }
  return null;
}


export const Canvas = ({
  boardId
}: CanvasProps) => {

  // const info = useSelf((me) => me.info);
  // console.log(info);

  const layerIds = useStorage((root) => root.layerIds);
  // console.log({ layerIds }, "Sulabh");

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [isPointerDown, setIsPointerDown] = useState(false);


  const [localCursor, setLocalCursor] = useState<Point | null>(null);

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const [camera, setCamera] = useState<Camera>(
    { x: 0, y: 0 }
  );

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0
  });

  useDisableScrollBounce();

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const eraseAtPoint = useMutation(({ storage, setMyPresence }, point: Point) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");
    const toDelete: string[] = [];

    for (const id of liveLayerIds) {
      const layer = liveLayers.get(id);
      if (!layer) continue;

      const x = layer.get("x");
      const y = layer.get("y");
      const width = layer.get("width");
      const height = layer.get("height");

      // If point is inside layer's bounding box + erase radius padding
      if (
        point.x >= x - ERASE_RADIUS &&
        point.x <= x + width + ERASE_RADIUS &&
        point.y >= y - ERASE_RADIUS &&
        point.y <= y + height + ERASE_RADIUS
      ) {
        toDelete.push(id);
      }
    }

    if (toDelete.length) {
      for (const id of toDelete) {
        liveLayers.delete(id);
        const index = liveLayerIds.indexOf(id);
        if (index !== -1) liveLayerIds.delete(index);
      }
      // Clear selection after erasing
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);


  const insertLayer = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Note | LayerType.Text,
    position: Point
  ) => {
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      return;
    }

    const liveLayerIds = storage.get("layerIds");

    const layerId = nanoid();

    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: lastUsedColor,
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({
      mode: CanvasMode.None,
    });
  }, [lastUsedColor]);

  const translateSelectedLayers = useMutation((
    { storage, self },
    point: Point
  ) => {
    if (canvasState.mode != CanvasMode.Translating) {
      return;
    }

    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    }

    const liveLayers = storage.get("layers");

    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        });
      }
    }

    setCanvasState(
      {
        mode: CanvasMode.Translating,
        current: point
      }
    );

  }, [
    canvasState,
  ])

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startMutliSelection = useCallback((
    current: Point,
    origin: Point
  ) => {
    if (Math.abs(current.x - origin.x)
      + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      })
    }
  }, [])


  const continueDrawing = useMutation((
    { self, setMyPresence },
    point: Point,
    e: React.PointerEvent,
  ) => {
    const { pencilDraft } = self.presence;

    if (
      canvasState.mode !== CanvasMode.Pencil ||
      e.buttons !== 1 ||
      pencilDraft === null
    ) {
      return;
    }

    setMyPresence({
      cursor: point,
      pencilDraft:
        pencilDraft.length == 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
          ? pencilDraft
          : [...pencilDraft, [point.x, point.y, e.pressure]],
    })
  }, [canvasState.mode]);

  const inserPath = useMutation((
    { storage, self, setMyPresence }
  ) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (
      pencilDraft == null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(penPointsToPathLayer(
        pencilDraft,
        lastUsedColor,
      )),
    )

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, [lastUsedColor])

  const startDrawing = useMutation((
    { setMyPresence },
    point: Point,
    pressure: number
  ) => {
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: lastUsedColor
    })
  }, [lastUsedColor]);


  const resizeSelecetedLayer = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode != CanvasMode.Resizing) {
      return;
    }

    const bounds = resizeBounds(
      canvasState.initialBounds,
      canvasState.corner,
      point
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if (layer) {
      layer.update(bounds);
    }

  }, [canvasState])

  const unselectLayers = useMutation((
    { self, setMyPresence }
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, [])

  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH,
  ) => {
    history.pause();
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner
    })
  }, [history]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // console.log({
    //   x: e.deltaX,
    //   y: e.deltaY,
    // });
    // console.log("sndlkjsdlk")

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
    setLocalCursor(current);

    if (canvasState.mode === CanvasMode.Pressing) {
      startMutliSelection(current, canvasState.origin)
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelectionNet(current, canvasState.origin)
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayers(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelecetedLayer(current);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e);
    } else if (canvasState.mode === CanvasMode.Erasing) {
      if (isPointerDown) {
        eraseAtPoint(current);
        setMyPresence({ selection: [] }, { addToHistory: true });
      }
      return;
    }


    setMyPresence({ cursor: current });
  }, [
    camera,
    canvasState,
    isPointerDown,
    eraseAtPoint,
    continueDrawing,
    updateSelectionNet,
    startMutliSelection,
    resizeSelecetedLayer,
    translateSelectedLayers,
  ]);

  const onPointerLeave = useMutation((
    { setMyPresence }
  ) => {
    setMyPresence({ cursor: null });
    setIsPointerDown(false); // <-- also reset on pointer leave
    setLocalCursor(null);
  }, []);

  const onPointerDown = useCallback((
    e: React.PointerEvent,
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);
    setLocalCursor(point);
    if (canvasState.mode === CanvasMode.Inserting) {
      return;
    }

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure);
      return;
    }

    setLocalCursor(point);
    setIsPointerDown(true);


    if (canvasState.mode === CanvasMode.Erasing) {
      eraseAtPoint(point);
      return;
    }

    setCanvasState({ origin: point, mode: CanvasMode.Pressing });
  }, [
    camera,
    canvasState.mode,
    setCanvasState,
    startDrawing,
    eraseAtPoint
  ]);

  const onPointerUp = useMutation((
    { },
    e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);
    setIsPointerDown(false);  // <-- pointer released
    setLocalCursor(null);
    if (
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {
      unselectLayers();
      setCanvasState({
        mode: CanvasMode.None,
      });
    } else if (canvasState.mode === CanvasMode.Pencil) {
      inserPath();
    } else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({
        mode: CanvasMode.None,
      });
    }

    history.resume();
  }, [
    camera,
    history,
    canvasState,
    insertLayer,
    setCanvasState,
    setCanvasState,
    unselectLayers,
    inserPath
  ]);

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation((
    { self, setMyPresence },
    e: React.PointerEvent,
    layerId: string,
  ) => {
    const point = pointerEventToCanvasPoint(e, camera);
    if (canvasState.mode === CanvasMode.Erasing) {
      eraseAtPoint(point);
      return;
    }

    if (
      canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting
    ) {
      return;
    }

    history.pause();
    e.stopPropagation()


    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true })
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });

  }, [
    camera,
    history,
    eraseAtPoint,
    setCanvasState,
    canvasState.mode,
  ])

  const layerIdsToColorSelection = useMemo(() => {

    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
      }
    }

    return layerIdsToColorSelection;
  }, [selections])

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    }
  }, [deleteLayers, history]);

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

      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />

      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}

          <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />

          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null &&
            (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )
          }

          <CursorPresence />
          {Array.isArray(pencilDraft) &&
            pencilDraft.length > 0 &&
            pencilDraft.every(
              (pt) =>
                Array.isArray(pt) &&
                pt.length >= 2 &&
                pt.every((num) => typeof num === "number")
            ) && (
              <Path
                fill={colorToCss(lastUsedColor)}
                points={pencilDraft as number[][]}
                x={0}
                y={0}
              />
            )}

          {canvasState.mode === CanvasMode.Erasing && localCursor && (
            <circle
              cx={localCursor.x}
              cy={localCursor.y}
              r={ERASE_RADIUS}
              className="fill-red-500/20 stroke-red-500 stroke-1 pointer-events-none"
            />
          )}

        </g>
      </svg>
    </main>
  )
}