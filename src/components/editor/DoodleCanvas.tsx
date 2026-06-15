import React, { useRef, useEffect, useState } from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { Eraser, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface DoodleCanvasProps {
  noteId: string;
}

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({ noteId }) => {
  const { notes, updateDoodle } = useNotesStore();
  const note = notes.find(n => n.id === noteId);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#ec4899"); // pink default
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Handle Resize and load initial image
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth - 32;
    const height = Math.max(container.clientHeight - 120, 350);
    
    setDimensions({ width, height });

    // Set canvas internal resolution
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw saved doodle if it exists
    if (note?.doodleData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = note.doodleData;
    }
  }, [noteId, note?.doodleData]);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    
    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : brushColor;
    ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveDoodle();
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Touch event vs Mouse event coordinate extraction
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const saveDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL("image/png");
    updateDoodle(noteId, base64);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    saveDoodle();
  };

  const colors = ["#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#1e293b"];

  return (
    <div ref={containerRef} className="flex flex-col gap-4 p-4 h-full overflow-hidden select-none">
      {/* Canvas Toolset Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/50 p-2 rounded-xl border border-border">
        <div className="flex items-center gap-1.5">
          <Button
            variant={tool === "pen" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTool("pen")}
            className="gap-1 text-xs cursor-pointer"
          >
            <Pencil className="size-3.5" />
            Pen
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTool("eraser")}
            className="gap-1 text-xs cursor-pointer"
          >
            <Eraser className="size-3.5" />
            Eraser
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            className="gap-1 hover:text-destructive hover:bg-destructive/10 text-xs cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            Clear
          </Button>
        </div>

        {tool === "pen" && (
          <div className="flex items-center gap-1.5">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                style={{ backgroundColor: color }}
                className={cn(
                  "size-5 rounded-full border border-black/10 transition-all cursor-pointer",
                  brushColor === color ? "scale-125 ring-2 ring-primary/45" : "hover:scale-110"
                )}
                aria-label={`Brush color ${color}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20 accent-primary cursor-pointer h-1 rounded-lg bg-border"
          />
          <span className="text-xs font-bold w-4 text-center">{brushSize}</span>
        </div>
      </div>

      {/* HTML5 Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-zinc-100 rounded-2xl border-2 border-dashed border-border overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ width: dimensions.width, height: dimensions.height }}
          className="cursor-crosshair shadow-sm touch-none bg-white block"
        />
      </div>
    </div>
  );
};
