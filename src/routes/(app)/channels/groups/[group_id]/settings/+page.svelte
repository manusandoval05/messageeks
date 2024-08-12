<script lang="ts">
	import { Accordion, AccordionItem, Avatar, popup, clipboard } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	export let data;
	$: ({ supabase, group_id } = data);

	const inviteGroupUrl = `${data.origin_url}/invite/group/${data.group_invite_id}`;

	const popupGroupMember: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupGroupMember',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
</script>

<div class="max-w-screen-lg">
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
		<AccordionItem>
			<svelte:fragment slot="lead">
				<span class="material-symbols-outlined"> diversity_2 </span>
			</svelte:fragment>
			<svelte:fragment slot="summary">Integrantes del grupo</svelte:fragment>
			<svelte:fragment slot="content">
				<ul class="list">
					{#await supabase
						.from('group_members')
						.select(`
							id,
							group_id, 
							user_id, 
							user_profiles(display_name)
						`)
						.eq('group_id', group_id) then response}
						{#each response.data ?? [] as group_member}
							<li>
								<Avatar initials="TU" width={'w-10'} />
								<span class="flex-auto">
									{group_member.user_profiles.display_name}
								</span>
								<button use:popup={popupGroupMember}>⋮</button>
							</li>
							<div class="card p-4 w-72 shadow-xl z-10" data-popup="popupGroupMember">
								<div class="flex flex-col gap-2">
									<button type="button" class="btn variant-filled-surface">
										<span class="material-symbols-outlined"> person_remove </span>
										<span>Quitar del grupo</span>
									</button>
								</div>
								<div class="arrow bg-surface-700" />
							</div>
						{/each}
					{/await}
					<!-- ... -->
				</ul>
			</svelte:fragment>
		</AccordionItem>
		<!-- ... -->
	</Accordion>
</div>
