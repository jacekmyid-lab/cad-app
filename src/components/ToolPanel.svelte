<script lang="ts">
  import Icon from './Icon.svelte';
  import { activeTool, objects, sketchMode, isExtruding, selectedObjectId } from '../stores/cadStore';
  import { createObject } from '../utils/cadUtils';
  import type { Tool, PrimitiveType } from '../types/cad';
  import type { icons } from './icons';

  type IconName = keyof typeof icons;

  const tools: Array<{ id: string; label: string; icon: IconName }> = [
    { id: 'select', label: 'Select', icon: 'Box' },
    { id: 'box', label: 'Box', icon: 'Square' },
    { id: 'sphere', label: 'Sphere', icon: 'Circle' },
    { id: 'cylinder', label: 'Cylinder', icon: 'Box' },
    { id: 'sketch', label: 'Sketch', icon: 'Pencil' },
    { id: 'plane', label: 'Plane', icon: 'Mountain' },
  ];

  function handleToolClick(toolId: string) {
    activeTool.set(toolId as Tool);
    
    if (toolId === 'sketch') {
      // Aktywuj sketch mode
      sketchMode.set('drawing');
    } else if (toolId !== 'select' && toolId !== 'rotate') {
      const newObject = createObject(toolId as PrimitiveType, $objects.length);
      objects.update(objs => [...objs, newObject]);
    }
  }

  function handleExtrude() {
    // Sprawdź czy zaznaczono sketch
    const selectedObj = $objects.find(obj => obj.id === $selectedObjectId);
    
    if (!selectedObj || selectedObj.type !== 'sketch') {
      alert('Najpierw zaznacz sketch aby go wyciągnąć!');
      return;
    }

    if (!selectedObj.metadata.sketchData?.closed) {
      alert('Sketch musi być zamknięty aby go wyciągnąć!');
      return;
    }

    isExtruding.set(true);
  }
</script>

<div class="w-16 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
  <div class="p-2 border-b border-gray-200 flex-shrink-0">
    <h2 class="text-[10px] font-bold text-gray-900 uppercase tracking-wide text-center">Tools</h2>
  </div>
  
  <div class="flex-1 overflow-y-auto p-2">
    <div class="mb-4">
      <div class="space-y-2">
        {#each tools as tool}
          <button
            onclick={() => handleToolClick(tool.id)}
            class="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 {$activeTool === tool.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}"
            title={tool.label}
          >
            <Icon name={tool.icon} size={20} />
          </button>
        {/each}
      </div>
    </div>

    <div class="border-t border-gray-200 pt-2 space-y-2">
      <button
        onclick={() => activeTool.set('rotate')}
        class="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 {$activeTool === 'rotate' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}"
        title="Rotate"
      >
        <Icon name="RotateCw" size={20} />
      </button>
      
      <button
        onclick={handleExtrude}
        class="w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100"
        title="Extrude"
      >
        <Icon name="Maximize" size={20} />
      </button>
    </div>
  </div>
</div>