"use client"
import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react"
import { ToolButton } from "./tool-button"
import { CanvasMode, type CanvasState, LayerType } from "@/types/canvas"

interface ToolbarProps {
  canvasState: CanvasState
  setCanavasState: (newState: CanvasState) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const Toolbar = ({ canvasState, setCanavasState, undo, redo, canUndo, canRedo }: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-y-3">
      {/* Main Tools Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 flex gap-y-1 flex-col items-center shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
        <div className="w-full mb-1">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
        </div>

        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => setCanavasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />

        <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1"></div>

        <ToolButton
          label="Text"
          icon={Type}
          onClick={() =>
            setCanavasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
        />
        <ToolButton
          label="Sticky notes"
          icon={StickyNote}
          onClick={() =>
            setCanavasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
        />

        <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1"></div>

        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() =>
            setCanavasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() =>
            setCanavasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
        />

        <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1"></div>

        <ToolButton
          label="Pen"
          icon={Pencil}
          onClick={() =>
            setCanavasState({
              mode: CanvasMode.Pencil,
            })
          }
          isActive={canvasState.mode === CanvasMode.Pencil}
        />

        <div className="w-full mt-1">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Undo/Redo Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 flex flex-col items-center shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
        <div className="w-full mb-1">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent rounded-full"></div>
        </div>

        <ToolButton label="Undo" icon={Undo2} onClick={undo} isDisabled={!canUndo} />
        <ToolButton label="Redo" icon={Redo2} onClick={redo} isDisabled={!canRedo} />

        <div className="w-full mt-1">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-y-3">
      {/* Main tools skeleton */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/50 w-[60px]">
        <div className="flex flex-col gap-y-1 items-center">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full w-full mb-1"></div>

          {/* Tool button skeletons */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
              {i < 5 && i % 2 === 0 && (
                <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1"></div>
              )}
            </div>
          ))}

          <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full w-full mt-1"></div>
        </div>
      </div>

      {/* Undo/Redo skeleton */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/50 w-[60px]">
        <div className="flex flex-col gap-y-1 items-center">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full w-full mb-1"></div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>

          <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full w-full mt-1"></div>
        </div>
      </div>
    </div>
  )
}
