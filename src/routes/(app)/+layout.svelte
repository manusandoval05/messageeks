<script lang="ts">
	import '../../app.postcss';
	import { preferences } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.dataset.theme = $preferences.theme;
	});
</script>

<slot />
