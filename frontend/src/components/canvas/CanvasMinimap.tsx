import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Block } from '@/types';

interface CanvasMinimapProps {
  blocks: Block[];
  viewportBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
    zoom: number;
  };
  onViewportChange: (x: number, y: number) => void;
}

export function CanvasMinimap({ blocks, viewportBounds, onViewportChange }: CanvasMinimapProps) {
  // Calculate canvas bounds from all blocks
  const canvasBounds = useMemo(() => {
    if (blocks.length === 0) {
      return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    blocks.forEach(block => {
      const x = block.position.x;
      const y = block.position.y;
      const width = 300; // Approximate block width
      const height = 100; // Approximate block height

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    // Add padding
    const padding = 200;
    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
    };
  }, [blocks]);

  const canvasWidth = canvasBounds.maxX - canvasBounds.minX;
  const canvasHeight = canvasBounds.maxY - canvasBounds.minY;

  // Minimap dimensions
  const minimapWidth = 200;
  const minimapHeight = 150;

  // Scale factors
  const scaleX = minimapWidth / canvasWidth;
  const scaleY = minimapHeight / canvasHeight;
  const scale = Math.min(scaleX, scaleY);

  // Transform canvas coordinates to minimap coordinates
  const toMinimapCoords = (x: number, y: number) => {
    return {
      x: (x - canvasBounds.minX) * scale,
      y: (y - canvasBounds.minY) * scale,
    };
  };

  // Viewport rectangle in minimap
  const viewportRect = {
    x: (viewportBounds.x - canvasBounds.minX) * scale,
    y: (viewportBounds.y - canvasBounds.minY) * scale,
    width: viewportBounds.width * scale / viewportBounds.zoom,
    height: viewportBounds.height * scale / viewportBounds.zoom,
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert minimap coordinates back to canvas coordinates
    const canvasX = (x / scale) + canvasBounds.minX;
    const canvasY = (y / scale) + canvasBounds.minY;

    onViewportChange(canvasX, canvasY);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 bg-zinc-900 border-4 border-black rounded-lg shadow-[6px_6px_0_0_#000] overflow-hidden"
      style={{ width: minimapWidth, height: minimapHeight }}
    >
      {/* Header */}
      <div className="bg-zinc-800 border-b-2 border-black px-2 py-1">
        <span className="text-xs font-bold text-zinc-400">MINIMAP</span>
      </div>

      {/* Minimap Content */}
      <div
        className="relative w-full h-[calc(100%-28px)] bg-zinc-950 cursor-crosshair"
        onClick={handleMinimapClick}
      >
        {/* Render blocks */}
        {blocks.map(block => {
          const pos = toMinimapCoords(block.position.x, block.position.y);
          const color = getCategoryColor(block.data.category);

          return (
            <div
              key={block.id}
              className="absolute rounded"
              style={{
                left: pos.x,
                top: pos.y,
                width: 300 * scale,
                height: 100 * scale,
                backgroundColor: color,
                opacity: 0.8,
              }}
            />
          );
        })}

        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-[#5865F2] bg-[#5865F2]/10"
          style={{
            left: viewportRect.x,
            top: viewportRect.y,
            width: viewportRect.width,
            height: viewportRect.height,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Footer stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 border-t-2 border-black px-2 py-1">
        <span className="text-[10px] font-mono text-zinc-500">
          {blocks.length} blocks
        </span>
      </div>
    </motion.div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    triggers: '#10b981', // emerald
    actions: '#3b82f6', // blue
    moderation: '#ef4444', // red
    logic: '#f59e0b', // amber
    data: '#8b5cf6', // violet
    utility: '#06b6d4', // cyan
  };

  return colors[category] || '#6b7280'; // gray fallback
}
