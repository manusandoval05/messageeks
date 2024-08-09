<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { clipboard } from '@skeletonlabs/skeleton';

	export let data;

	const inviteGroupUrl = `${data.origin_url}/invite/group/${data.group_invite_id}`;
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="lead">
			<span class="material-symbols-outlined"> share </span>
		</svelte:fragment>
		<svelte:fragment slot="summary">Enlace de invitación</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="flex gap-2">
				<p class="pt-2">{inviteGroupUrl}</p>
				<button class="btn variant-filled" use:clipboard={inviteGroupUrl}>Copiar</button>
			</div>
		</svelte:fragment>
	</AccordionItem>
	<!-- ... -->
</Accordion>
