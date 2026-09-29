import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface ChartSeries {
  name: string;
  data: number[];
  color: string;
  fillColor?: string;
  dashed?: boolean;
}

interface InteractiveChartProps {
  xLabels: (number | string)[];
  series: ChartSeries[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  yUnit?: string;
  xUnit?: string;
  height?: number;
  highlightX?: number | string;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  xLabels,
  series,
  xAxisTitle = 'X 축',
  yAxisTitle = 'Y 축',
  yUnit = '',
  xUnit = '',
  height = 320,
  highlightX
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = containerWidth;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 24, right: 30, bottom: 44, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    if (chartW <= 0 || chartH <= 0 || xLabels.length === 0) return;

    // Determine min and max Y across all series
    let minY = Infinity;
    let maxY = -Infinity;
    series.forEach((s) => {
      s.data.forEach((val) => {
        if (Number.isFinite(val)) {
          if (val < minY) minY = val;
          if (val > maxY) maxY = val;
        }
      });
    });

    if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
      minY = 0;
      maxY = 100;
    }
    if (minY === maxY) {
      minY = Math.max(0, minY - 10);
      maxY = maxY + 10;
    } else {
      // Add slight headroom
      const ySpan = maxY - minY;
      maxY = maxY + ySpan * 0.08;
      minY = Math.max(0, minY - ySpan * 0.04);
    }

    const getX = (index: number) => {
      return padding.left + (index / (xLabels.length - 1)) * chartW;
    };

    const getY = (val: number) => {
      const norm = (val - minY) / (maxY - minY);
      return padding.top + (1 - norm) * chartH;
    };

    // Draw horizontal gridlines & Y labels
    const yTicks = 5;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= yTicks; i++) {
      const ratio = i / yTicks;
      const yVal = minY + ratio * (maxY - minY);
      const yPos = padding.top + (1 - ratio) * chartH;

      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(width - padding.right, yPos);
      ctx.stroke();

      const formattedVal = yVal >= 100 ? yVal.toFixed(0) : yVal >= 10 ? yVal.toFixed(1) : yVal.toFixed(2);
      ctx.fillText(`${formattedVal} ${yUnit}`, padding.left - 8, yPos);
    }

    // Draw vertical gridlines & X labels (selective steps)
    const xStep = Math.max(1, Math.floor(xLabels.length / 7));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < xLabels.length; i += xStep) {
      const xPos = getX(i);
      ctx.beginPath();
      ctx.strokeStyle = '#f1f5f9';
      ctx.moveTo(xPos, padding.top);
      ctx.lineTo(xPos, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.fillText(`${xLabels[i]}${xUnit ? ' ' + xUnit : ''}`, xPos, height - padding.bottom + 8);
    }

    // Highlight specific X coordinate if passed
    if (highlightX !== undefined) {
      const idx = xLabels.findIndex(
        (l) => l.toString() === highlightX.toString() || Math.abs(Number(l) - Number(highlightX)) < 0.001
      );
      if (idx !== -1) {
        const hx = getX(idx);
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hx, padding.top);
        ctx.lineTo(hx, height - padding.bottom);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw Series Lines and Areas
    series.forEach((s) => {
      if (s.data.length === 0) return;

      // Fill area if specified
      if (s.fillColor) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(getX(0), height - padding.bottom);
        s.data.forEach((val, i) => {
          ctx.lineTo(getX(i), getY(val));
        });
        ctx.lineTo(getX(s.data.length - 1), height - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = s.fillColor;
        ctx.fill();
        ctx.restore();
      }

      // Draw stroke
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      if (s.dashed) {
        ctx.setLineDash([6, 4]);
      }

      s.data.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    });

    // Hover crosshair and point rendering
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < xLabels.length) {
      const hoverX = getX(hoverIndex);

      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hoverX, padding.top);
      ctx.lineTo(hoverX, height - padding.bottom);
      ctx.stroke();
      ctx.restore();

      // Points on lines
      series.forEach((s) => {
        const val = s.data[hoverIndex];
        if (val !== undefined) {
          const py = getY(val);
          ctx.save();
          ctx.beginPath();
          ctx.arc(hoverX, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // Axis titles
    ctx.save();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#475569';
    // Y-axis label
    ctx.textAlign = 'left';
    ctx.fillText(yAxisTitle, padding.left - 4, padding.top - 12);
    // X-axis label
    ctx.textAlign = 'right';
    ctx.fillText(xAxisTitle, width - padding.right, height - 6);
    ctx.restore();
  }, [containerWidth, height, xLabels, series, xAxisTitle, yAxisTitle, yUnit, xUnit, highlightX, hoverIndex]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPos = e.clientX - rect.left;

    const padding = { left: 60, right: 30 };
    const chartW = containerWidth - padding.left - padding.right;

    if (xPos < padding.left || xPos > containerWidth - padding.right) {
      setHoverIndex(null);
      return;
    }

    const relX = xPos - padding.left;
    const index = Math.round((relX / chartW) * (xLabels.length - 1));
    if (index >= 0 && index < xLabels.length) {
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div ref={containerRef} className="w-full relative select-none">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair block"
      />

      {/* Floating Hover Card */}
      {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < xLabels.length && (
        <div
          className="absolute top-2 right-4 bg-slate-900/90 text-white backdrop-blur-md px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700 pointer-events-none z-10 space-y-1 font-mono"
        >
          <div className="text-slate-400 font-semibold">
            {xAxisTitle}: {xLabels[hoverIndex]} {xUnit}
          </div>
          {series.map((s, i) => (
            <div key={i} className="flex items-center space-x-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }}></span>
              <span className="text-slate-300">{s.name}:</span>
              <span className="font-bold text-amber-300">
                {s.data[hoverIndex] !== undefined ? s.data[hoverIndex].toFixed(2) : '-'} {yUnit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
