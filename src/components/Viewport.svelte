<script lang="ts">
  import Icon from './Icon.svelte';
  import { objects, sketchMode } from '../stores/cadStore';
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
</script>

<div class="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative h-full">
  {#if $objects.length === 0 && $sketchMode === 'none'}
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div class="text-center">
        <div class="mb-4 opacity-30 flex justify-center">
          <Icon name="Grid3x3" size={64} />
        </div>
        <p class="text-gray-500 text-lg font-medium">3D Viewport</p>
        <p class="text-gray-400 text-sm mt-2">Wybierz narzędzie z lewego panelu</p>
      </div>
    </div>
  {/if}

  {#if $sketchMode === 'drawing'}
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
      <p class="text-sm font-medium">Kliknij na płaszczyźnie aby dodać punkty | ESC - Anuluj | ENTER - Zamknij (min. 3 punkty)</p>
    </div>
  {/if}
  
  <div class="w-full h-full">
    <Canvas>
      <Scene />
    </Canvas>
  </div>
</div>