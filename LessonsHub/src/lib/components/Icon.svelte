<script lang="ts">
  import { icons } from '$lib/icons';
  import type { IconName } from '$lib/icons';

  let {
    name,
    size = 20,
    class: className = '',
  }: {
    name: IconName;
    size?: number;
    class?: string;
  } = $props();

  let pathData = $derived(icons[name]);
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  aria-hidden="true"
>
  <path
    d={pathData}
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
</svg>
