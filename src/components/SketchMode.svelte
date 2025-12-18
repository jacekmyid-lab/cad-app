<script lang="ts">
  import { sketchMode, currentSketchId, objects, selectedObjectId } from '../stores/cadStore';
  import type { SketchPoint } from '../types/cad';

  interface Props {
    onComplete?: (sketchId: string) => void;
  }

  let { onComplete }: Props = $props();

  let canvasElement: HTMLCanvasElement | undefined = $state(undefined);
  let ctx: CanvasRenderingContext2D | null = null;
  let points: SketchPoint[] = $state([]);
  let isDrawing = $state(false);
  let previewPoint: SketchPoint | null = $state(null);

  // Inicjalizuj kontekst gdy canvas jest dostępny
  $effect(() => {
    if (canvasElement && !ctx) {
      ctx = canvasElement.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      }
    }
  });

  function getCanvasCoordinates(e: MouseEvent): SketchPoint {
    if (!canvasElement) return { x: 0, y: 0 };
    const rect = canvasElement.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function handleClick(e: MouseEvent) {
    if (!ctx || $sketchMode !== 'drawing' || !canvasElement) return;

    const point = getCanvasCoordinates(e);

    // Sprawdź czy kliknięto blisko pierwszego punktu (zamknięcie)
    if (points.length >= 3) {
      const firstPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(point.x - firstPoint.x, 2) + 
        Math.pow(point.y - firstPoint.y, 2)
      );

      if (distance < 10) {
        // Zamknij sketch
        closeSketch();
        return;
      }
    }

    points = [...points, point];
    isDrawing = true;
    redraw();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!ctx || $sketchMode !== 'drawing' || points.length === 0 || !canvasElement) return;

    previewPoint = getCanvasCoordinates(e);
    redraw();
  }

  function redraw() {
    if (!ctx || !canvasElement) return;

    // Wyczyść canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (points.length === 0) return;

    // Rysuj linie
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    // Rysuj linię podglądu
    if (previewPoint && points.length > 0) {
      ctx.lineTo(previewPoint.x, previewPoint.y);
    }

    ctx.stroke();

    // Rysuj punkty
    points.forEach((point, index) => {
      ctx!.beginPath();
      ctx!.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx!.fillStyle = index === 0 ? '#ef4444' : '#3b82f6';
      ctx!.fill();
    });

    // Podświetl pierwszy punkt jeśli jesteśmy blisko
    if (points.length >= 3 && previewPoint) {
      const firstPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(previewPoint.x - firstPoint.x, 2) + 
        Math.pow(previewPoint.y - firstPoint.y, 2)
      );

      if (distance < 10) {
        ctx!.beginPath();
        ctx!.arc(firstPoint.x, firstPoint.y, 8, 0, Math.PI * 2);
        ctx!.strokeStyle = '#ef4444';
        ctx!.lineWidth = 3;
        ctx!.stroke();
        ctx!.strokeStyle = '#3b82f6';
        ctx!.lineWidth = 2;
      }
    }
  }

  function closeSketch() {
    if (points.length < 3) {
      alert('Potrzebujesz co najmniej 3 punkty aby zamknąć sketch!');
      return;
    }

    // Normalizuj punkty do zakresu -1 do 1 (dla Three.js)
    const centerX = canvasElement!.width / 2;
    const centerY = canvasElement!.height / 2;
    const scale = Math.min(canvasElement!.width, canvasElement!.height) / 2;

    const normalizedPoints = points.map(p => ({
      x: (p.x - centerX) / scale,
      y: -(p.y - centerY) / scale // Odwróć Y dla Three.js
    }));

    // Utwórz zamknięty sketch
    const sketchId = `sketch_${Date.now()}`;
    
    objects.update(objs => [...objs, {
      id: sketchId,
      type: 'sketch',
      name: `Sketch_${objs.filter(o => o.type === 'sketch').length + 1}`,
      metadata: {
        color: '#3b82f6',
        smoothness: 1,
        tolerance: 0.01,
        sketchData: {
          points: normalizedPoints,
          closed: true,
          planePosition: [0, 0, 0],
          planeRotation: [0, 0, 0]
        }
      },
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      }
    }]);

    currentSketchId.set(sketchId);
    selectedObjectId.set(sketchId);
    
    // Wróć do widoku 3D
    sketchMode.set('none');
    
    // Reset
    points = [];
    previewPoint = null;
    isDrawing = false;
    
    if (ctx && canvasElement) {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }

    onComplete?.(sketchId);
  }

  function cancel() {
    points = [];
    previewPoint = null;
    isDrawing = false;
    sketchMode.set('none');
    
    if (ctx && canvasElement) {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
  }
</script>

{#if $sketchMode === 'drawing'}
  <div class="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 shadow-lg">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        Sketch Mode
      </h2>
      <p class="text-sm mt-1 opacity-90">Kliknij aby dodać punkty. Kliknij na pierwszy punkt (czerwony) aby zamknąć sketch.</p>
      <div class="mt-3 flex gap-3">
        <button 
          onclick={cancel}
          class="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md"
        >
          ✕ Anuluj (ESC)
        </button>
        {#if points.length >= 3}
          <button 
            onclick={closeSketch}
            class="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md animate-pulse"
          >
            ✓ Zamknij sketch (ENTER)
          </button>
        {/if}
      </div>
    </div>

    <!-- Canvas -->
    <div class="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="relative">
        <canvas
          bind:this={canvasElement}
          width={800}
          height={600}
          class="border-2 border-blue-300 bg-white cursor-crosshair shadow-2xl rounded-lg"
          onclick={handleClick}
          onmousemove={handleMouseMove}
        />
        {#if points.length === 0}
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p class="text-gray-400 text-lg">Kliknij aby rozpocząć...</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Info -->
    <div class="bg-white border-t border-gray-200 p-4 shadow-lg">
      <div class="flex items-center justify-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="font-medium">Punkty: {points.length}</span>
        </div>
        <div class="h-4 w-px bg-gray-300"></div>
        <div class={points.length >= 3 ? 'text-green-600 font-semibold' : 'text-gray-500'}>
          {#if points.length < 3}
            Minimum 3 punkty wymagane
          {:else}
            ✓ Gotowy do zamknięcia
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window 
  onkeydown={(e) => {
    if ($sketchMode === 'drawing') {
      if (e.key === 'Escape') cancel();
      if (e.key === 'Enter' && points.length >= 3) closeSketch();
    }
  }}
/>