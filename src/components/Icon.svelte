<script lang="ts">
  import { icons } from './icons';
  
  interface Props {
    name: keyof typeof icons;
    size?: number;
  }
  
  let { name, size = 20 }: Props = $props();
</script>

<span class="inline-flex" style="width: {size}px; height: {size}px;">
  {@html icons[name]}
</span>