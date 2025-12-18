<script lang="ts">
  import Toolbar from './components/Toolbar.svelte';
  import ToolPanel from './components/ToolPanel.svelte';
  import ObjectTree from './components/ObjectTree.svelte';
  import Viewport from './components/Viewport.svelte';
  import PropertiesPanel from './components/PropertiesPanel.svelte';
</script>

<div class="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
  <!-- Top Toolbar - pełna szerokość -->
  <Toolbar />
  
  <!-- Main Content Area - 4 kolumny -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Left Panel - Tools (węższa) -->
    <ToolPanel />
    
    <!-- Center Viewport -->
    <div class="flex-1 overflow-hidden">
      <Viewport />
    </div>
    
    <!-- Object Tree Panel (po prawej od viewportu) -->
    <ObjectTree />
    
    <!-- Right Panel - Properties (węższa) -->
    <PropertiesPanel />
  </div>
</div>