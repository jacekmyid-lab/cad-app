<script lang="ts">
  import { T } from '@threlte/core';
  import * as THREE from 'three';
  import { sketchMode, objects, selectedObjectId } from '../stores/cadStore';
  import type { SketchPoint } from '../types/cad';
  
  let points: SketchPoint[] = $state([]);
  let planeRef: THREE.Mesh | undefined = undefined;
  let hoveringFirstPoint = $state(false);

  function handlePlaneClick(event: any) {
    console.log('=== KLIKNIĘCIE NA PLANE ===');
    console.log('🔍 Current sketchMode:', $sketchMode); // DODANE
    
    if ($sketchMode !== 'drawing') {
      console.log('❌ Nie w trybie rysowania');
      return;
    }

    if (!planeRef) {
      console.error('❌ Brak referencji do plane');
      return;
    }

    if (!event.point) {
      console.error('❌ Event nie zawiera punktu');
      return;
    }

    const worldPoint = event.point.clone();
    console.log('📍 WORLD SPACE:', { 
      x: worldPoint.x.toFixed(2), 
      y: worldPoint.y.toFixed(2), 
      z: worldPoint.z.toFixed(2) 
    });

    const localPoint = planeRef.worldToLocal(worldPoint);
    console.log('📍 LOCAL SPACE:', { 
      x: localPoint.x.toFixed(2), 
      y: localPoint.y.toFixed(2), 
      z: localPoint.z.toFixed(2) 
    });

    const newPoint: SketchPoint = { 
      x: localPoint.x, 
      y: localPoint.y 
    };

    if (points.length >= 3) {
      const firstPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(newPoint.x - firstPoint.x, 2) + 
        Math.pow(newPoint.y - firstPoint.y, 2)
      );

      console.log('📏 Odległość od pierwszego punktu:', distance.toFixed(2));

      if (distance < 1.0) {
        console.log('✅ ZAMYKANIE SKETCHU');
        closeSketch();
        return;
      }
    }

    points = [...points, newPoint];
    console.log(`✅ Dodano punkt #${points.length}:`, newPoint);
  }

  function handleMouseMove(event: any) {
    if ($sketchMode !== 'drawing' || points.length < 3 || !planeRef) {
      hoveringFirstPoint = false;
      return;
    }

    if (event.point) {
      const worldPoint = event.point.clone();
      const localPoint = planeRef.worldToLocal(worldPoint);

      const firstPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(localPoint.x - firstPoint.x, 2) + 
        Math.pow(localPoint.y - firstPoint.y, 2)
      );

      hoveringFirstPoint = distance < 1.0;
    }
  }

  function closeSketch() {
    if (points.length < 3) {
      console.error('❌ Za mało punktów do zamknięcia (minimum 3)');
      return;
    }

    console.log('=== TWORZENIE OBIEKTU SKETCH ===');
    console.log('Punkty w LOCAL SPACE:', $state.snapshot(points));

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
          points: $state.snapshot(points),
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

    console.log('✅ Obiekt sketch utworzony:', sketchId);

    selectedObjectId.set(sketchId);
    sketchMode.set('none');
    
    points = [];
    hoveringFirstPoint = false;
  }

  function cancel() {
    console.log('❌ ANULOWANO SKETCH');
    points = [];
    hoveringFirstPoint = false;
    sketchMode.set('none');
  }

  // DEBUG: Loguj zmiany
  $effect(() => {
    console.log('🎨 SketchPlane: sketchMode changed to:', $sketchMode);
    console.log('📊 SketchPlane: points count:', points.length);
  });
</script>

{#if $sketchMode === 'drawing'}
  <!-- DEBUG: RÓŻOWA KULA - jeśli ją widzisz, SketchPlane działa -->
  <T.Mesh position={[0, 0, 0.5]}>
    <T.SphereGeometry args={[0.5, 16, 16]} />
    <T.MeshBasicMaterial color="#ff00ff" />
  </T.Mesh>

  <T.Group position={[0, 0, 0]} rotation={[0, 0, 0]}>
    
    <T.Mesh 
      bind:ref={planeRef}
      interactive
      onclick={handlePlaneClick}
      onpointermove={handleMouseMove}
    >
      <T.PlaneGeometry args={[20, 20]} />
      <T.MeshBasicMaterial 
        color="#e0e7ff" 
        transparent
        opacity={0.3}
        side={2}
      />
    </T.Mesh>

    <T.GridHelper 
      args={[20, 20, '#3b82f6', '#93c5fd']} 
      position={[0, 0, 0.001]} 
      rotation={[Math.PI / 2, 0, 0]} 
    />

    <!-- LINIE -->
    {#each points as point, i}
      {#if i > 0}
        {@const prevPoint = points[i - 1]}
        {@const dx = point.x - prevPoint.x}
        {@const dy = point.y - prevPoint.y}
        {@const length = Math.sqrt(dx * dx + dy * dy)}
        {@const angle = Math.atan2(dy, dx)}
        {@const centerX = (prevPoint.x + point.x) / 2}
        {@const centerY = (prevPoint.y + point.y) / 2}
        
        <T.Mesh 
          position={[centerX, centerY, 0.03]}
          rotation={[0, 0, angle]}
        >
          <T.BoxGeometry args={[length, 0.08, 0.01]} />
          <T.MeshBasicMaterial color="#3b82f6" />
        </T.Mesh>
      {/if}
    {/each}

    <!-- PUNKTY - DEBUGOWANE -->
    {#each points as point, i (i)}
      <T.Mesh position={[point.x, point.y, 0.05]}>
        <T.SphereGeometry args={[i === 0 ? 0.25 : 0.15, 16, 16]} />
        <T.MeshBasicMaterial color={i === 0 ? '#ef4444' : '#3b82f6'} />
      </T.Mesh>
      <!-- DEBUG: Log każdego punktu -->
      {console.log(`🔴 Renderuję punkt ${i}:`, point)}
    {/each}

    <!-- Podświetlenie pierwszego punktu -->
    {#if points.length >= 3}
      <T.Mesh position={[points[0].x, points[0].y, 0.06]}>
        <T.SphereGeometry args={[hoveringFirstPoint ? 0.5 : 0.35, 16, 16]} />
        <T.MeshBasicMaterial 
          color={hoveringFirstPoint ? '#22c55e' : '#ef4444'} 
          transparent 
          opacity={0.5} 
          wireframe 
        />
      </T.Mesh>
    {/if}

    <!-- Paski informacyjne -->
    <T.Group position={[0, 8.5, 0.1]}>
      <T.Mesh>
        <T.PlaneGeometry args={[12, 0.8]} />
        <T.MeshBasicMaterial color="#1e40af" />
      </T.Mesh>
    </T.Group>

    {#if points.length >= 3}
      <T.Group position={[0, 7.5, 0.1]}>
        <T.Mesh>
          <T.PlaneGeometry args={[10, 0.6]} />
          <T.MeshBasicMaterial color={hoveringFirstPoint ? '#22c55e' : '#ef4444'} />
        </T.Mesh>
      </T.Group>
    {/if}
  </T.Group>
{:else}
  <!-- DEBUG: Pokaż że NIE jesteśmy w trybie sketch -->
  {console.log('❌ SketchPlane NIE renderuje się, sketchMode:', $sketchMode)}
{/if}

<svelte:window 
  onkeydown={(e) => {
    if ($sketchMode === 'drawing') {
      if (e.key === 'Escape') {
        cancel();
      }
      if (e.key === 'Enter' && points.length >= 3) {
        closeSketch();
      }
    }
  }}
/>