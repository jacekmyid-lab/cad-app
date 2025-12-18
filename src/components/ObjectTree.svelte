<script lang="ts">
  import { objects, selectedObjectId } from '../stores/cadStore';
  import Icon from './Icon.svelte';
  import type { IconName } from './icons';
  
  function selectObject(id: string) {
    selectedObjectId.set(id);
  }
  
  function deleteObject(id: string) {
    objects.update(objs => objs.filter(obj => obj.id !== id));
    if ($selectedObjectId === id) {
      selectedObjectId.set(null);
    }
  }
  
  function getIconForType(type: string): IconName {
    switch(type) {
      case 'box': return 'Square';
      case 'sphere': return 'Circle';
      case 'cylinder': return 'Box';
      case 'sketch': return 'Pencil';
      case 'plane': return 'Mountain';
      default: return 'Box';
    }
  }
</script>

<div class="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
  <div class="p-4 border-b border-gray-200 flex-shrink-0">
    <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Scene Objects</h2>
  </div>
  
  <div class="flex-1 overflow-y-auto p-2">
    {#if $objects.length === 0}
      <div class="flex items-center justify-center h-full">
        <p class="text-sm text-gray-400 text-center px-4">No objects in scene</p>
      </div>
    {:else}
      <div class="space-y-1">
        {#each $objects as obj (obj.id)}
          <div
            class="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all {$selectedObjectId === obj.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}"
            onclick={() => selectObject(obj.id)}
          >
            <div class="flex-shrink-0">
              <Icon name={getIconForType(obj.type)} size={16} />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{obj.name}</p>
              <p class="text-xs opacity-70 capitalize">{obj.type}</p>
            </div>
            <button
              onclick={(e) => {
                e.stopPropagation();
                deleteObject(obj.id);
              }}
              class="opacity-0 group-hover:opacity-100 p-1 rounded transition-all {$selectedObjectId === obj.id ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}"
              title="Delete object"
            >
              <Icon name="Trash" size={14} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>