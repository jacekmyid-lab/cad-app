<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls, Grid } from '@threlte/extras';
  import { objects, selectedObjectId, sketchMode } from '../stores/cadStore';
  import CADObjectRenderer from './CADObjectRenderer.svelte';
  import SketchPlane from './SketchPlane.svelte';
  import { interactivity } from '@threlte/extras';
  
  // Włącz interaktywność dla wszystkich obiektów 3D
  interactivity();
  
  let orbitControlsRef: any = $state(null);
  
  // DWIE KAMERY - JEDNA SCENA
  // PerspectiveCamera - widok 3D z perspektywą
  // OrthographicCamera - widok 2D ortogonalny (dla sketch)
  
  // Rozmiar obszaru widocznego dla OrthographicCamera
  const orthoSize = 10;
</script>

<!-- ŚWIATŁA - wspólne dla obu trybów -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 5]} intensity={1} castShadow />
<T.DirectionalLight position={[-10, 10, -5]} intensity={0.5} />

<!-- 
  PERSPECTIVE CAMERA (3D)
  - Używana gdy sketchMode !== 'drawing'
  - makeDefault={true/false} określa która kamera jest aktywna
  - OrbitControls działają tylko w tym trybie
-->
<T.PerspectiveCamera 
  makeDefault={$sketchMode !== 'drawing'}
  position={[5, 5, 5]} 
  fov={50}
>
  {#if $sketchMode !== 'drawing'}
    <!-- OrbitControls TYLKO dla widoku 3D -->
    <OrbitControls bind:ref={orbitControlsRef} enableDamping />
  {/if}
</T.PerspectiveCamera>

<!-- 
  ORTHOGRAPHIC CAMERA (2D dla Sketch)
  - Używana gdy sketchMode === 'drawing'
  - Patrzy z góry (0, 0, 10) prostopadle na plane Z=0
  - left/right/top/bottom definiują prostokątny obszar widzenia
  - Brak perspektywy = idealne dla rysowania 2D
-->
<T.OrthographicCamera
  makeDefault={$sketchMode === 'drawing'}
  position={[0, 0, 15]}
  zoom={20} 
  left={-orthoSize}
  right={orthoSize}
  top={orthoSize}
  bottom={-orthoSize}
  near={0.1}
  far={100}
/>

<!-- 
  SIATKA - wspólna dla obu trybów
  Zawsze na płaszczyźnie XY w Z=0
-->
<Grid 
  infiniteGrid 
  sectionColor="#3b82f6" 
  sectionSize={1} 
  cellColor="#93c5fd" 
  cellSize={0.5}
  fadeDistance={30}
  cellThickness={0.5}
  sectionThickness={1}
/>

<!-- 
  SKETCH PLANE
  - Renderuje się TYLKO gdy sketchMode === 'drawing'
  - Plane jest w pozycji [0,0,0] bez rotacji (uproszczenie na początek)
  - Wszystkie punkty sketchu są w LOCAL SPACE tego plane
-->
<SketchPlane />

<!-- 
  RENDEROWANIE OBIEKTÓW CAD
  - Wszystkie obiekty (box, sphere, cylinder, sketch)
  - Każdy obiekt ma swój transform (position, rotation, scale)
-->
{#each $objects as obj (obj.id)}
  <CADObjectRenderer 
    object={obj} 
    selected={$selectedObjectId === obj.id}
    onselect={() => {
      console.log('Scene: Object selected', obj.id);
      selectedObjectId.set(obj.id);
    }}
  />
{/each}