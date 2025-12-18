<script lang="ts">
  import Icon from './Icon.svelte';
</script>

<div class="h-7 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
  <h1 class="text-xl font-bold text-gray-800">CAD App</h1>
  
  <div class="flex-1"></div>
  
  <div class="flex items-center gap-3">
    <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Box" onclick={() => {}}>
      <Icon name="Box" size={16} />
    </button>
    <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Circle" onclick={() => {}}>
      <Icon name="Circle" size={16} />
    </button>
    <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Square" onclick={() => {}}>
      <Icon name="Square" size={16} />
    </button>
    <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Grid" onclick={() => {}}>
      <Icon name="Grid3x3" size={16} />
    </button>
    <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="View" onclick={() => {}}>
      <Icon name="Eye" size={16} />
    </button>
  </div>
</div>