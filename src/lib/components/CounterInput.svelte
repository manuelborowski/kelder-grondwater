<script lang="ts">
	export let count: number = 0;
</script>

<div class="py-1">
<button on:click={() => count -= 1} on:click class="bg-orange-200 border-2 border-orange-600 rounded-md px-1">-</button>
<input type="text" bind:value={count} on:change size=4 class="text-right bg-green-300 border-2 border-green-600 rounded-md">
<button on:click={() => count += 1} on:click class="bg-orange-200 border-2 border-orange-600 rounded-md px-1">+</button>
<span><slot>label</slot></span>
</div>

