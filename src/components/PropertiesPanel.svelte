<script lang="ts">
  import { objects, selectedObjectId } from '../stores/cadStore';
  import { exportToGLTF } from '../utils/gltfExporter';
  import { derived } from 'svelte/store';

  const selectedObj = derived(
    [objects, selectedObjectId],
    ([$objects, $selectedObjectId]) => $objects.find(obj => obj.id === $selectedObjectId)
  );

  function updateObjectMetadata(key: string, value: any) {
    const currentObj = $selectedObj;
    if (!currentObj) return;
    
    objects.update(objs => objs.map(obj => {
      if (obj.id === currentObj.id) {
        return {
          ...obj,
          metadata: {
            ...obj.metadata,
            [key]: value
          }
        };
      }
      return obj;
    }));
  }

  function updateDimension(key: string, value: number) {
    const currentObj = $selectedObj;
    if (!currentObj) return;
    
    objects.update(objs => objs.map(obj => {
      if (obj.id === currentObj.id) {
        return {
          ...obj,
          metadata: {
            ...obj.metadata,
            dimensions: {
              ...obj.metadata.dimensions,
              [key]: value
            }
          }
        };
      }
      return obj;
    }));
  }

  async function handleExport() {
    if ($objects.length === 0) {
      alert('Brak obiektów do eksportu!');
      return;
    }
    await exportToGLTF($objects);
  }
</script>

<div class="w-64 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
  <div class="p-3 border-b border-gray-200 flex-shrink-0">
    <h2 class="text-xs font-bold text-gray-900 uppercase tracking-wide">Properties</h2>
  </div>
  
  <div class="flex-1 overflow-y-auto p-3">
    {#if !$selectedObj}
      <div class="flex items-center justify-center h-full">
        <p class="text-xs text-gray-400 text-center">No objects selected</p>
      </div>
    {:else}
      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-bold text-gray-700 uppercase block mb-1.5 tracking-wide">
            Name
          </label>
          <input
            type="text"
            value={$selectedObj.name}
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-gray-50 font-medium text-gray-700"
            readonly
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-700 uppercase block mb-1.5 tracking-wide">
            Type
          </label>
          <div class="px-2 py-1.5 bg-blue-50 rounded-lg text-xs capitalize font-semibold text-blue-700">
            {$selectedObj.type}
          </div>
        </div>

        {#if $selectedObj.metadata.dimensions && Object.keys($selectedObj.metadata.dimensions).length > 0}
          <div>
            <label class="text-[10px] font-bold text-gray-700 uppercase block mb-2 tracking-wide">
              Dimensions
            </label>
            <div class="space-y-2">
              {#each Object.entries($selectedObj.metadata.dimensions) as [key, value]}
                <div>
                  <label class="text-[10px] text-gray-600 capitalize block mb-1 font-semibold">{key}</label>
                  <input
                    type="number"
                    value={value}
                    oninput={(e) => updateDimension(key, parseFloat(e.currentTarget.value))}
                    class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    step="0.1"
                    min="0.1"
                  />
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <div>
          <label class="text-[10px] font-bold text-gray-700 uppercase block mb-1.5 tracking-wide">
            Smoothness
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={$selectedObj.metadata.smoothness}
            oninput={(e) => updateObjectMetadata('smoothness', parseFloat(e.currentTarget.value))}
            class="w-full accent-blue-600 h-1.5 rounded-lg"
          />
          <div class="text-[10px] text-gray-600 text-right mt-1 font-semibold">{$selectedObj.metadata.smoothness}</div>
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-700 uppercase block mb-1.5 tracking-wide">
            Tolerance
          </label>
          <input
            type="number"
            value={$selectedObj.metadata.tolerance}
            oninput={(e) => updateObjectMetadata('tolerance', parseFloat(e.currentTarget.value))}
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            step="0.001"
            min="0.001"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-700 uppercase block mb-1.5 tracking-wide">
            Color
          </label>
          <input
            type="color"
            value={$selectedObj.metadata.color}
            oninput={(e) => updateObjectMetadata('color', e.currentTarget.value)}
            class="w-full h-8 rounded-lg cursor-pointer border-2 border-gray-300"
          />
        </div>

        <button 
          onclick={handleExport}
          class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold shadow-md hover:shadow-lg"
        >
          Export glTF
        </button>
      </div>
    {/if}
  </div>
</div>