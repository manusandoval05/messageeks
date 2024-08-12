<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Accordion,
		AccordionItem,
		AppBar,
		Avatar,
		popup,
		clipboard,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import type { PopupSettings, ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	export let data;
	$: ({ supabase, group_id, user } = data);

	let groupMembers: any[] = [];
	let selectedUser = {};

	const inviteGroupUrl = `${data.origin_url}/invite/group/${data.group_invite_id}`;

	const popupGroupMember: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupGroupMember',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};

	async function leaveGroup() {
		const userMemberId = groupMembers.filter((member) => member.user_id === user?.id).at(0);
		const { error } = await supabase.from('group_members').delete().eq('id', userMemberId);
		if (error) {
			console.error(error);
			return;
		}
		goto('/channels/groups');
	}

	async function deleteUser(user: any) {
		const modal: ModalSettings = {
			type: 'confirm',
			// Data
			title: `¿Expulsar a ${user.user_profiles.display_name}?`,
			body: `¿Quieres eliminar a ${user.user_profiles.display_name} del grupo?`,
			buttonTextSubmit: 'Confirmar',
			buttonTextConfirm: 'Confirmar',
			buttonTextCancel: 'Cancelar',
			// TRUE if confirm pressed, FALSE if cancel pressed
			response: async (modalResponse: boolean) => {
				if (modalResponse) {
					const { error } = await supabase.from('group_members').delete().eq('id', user.id);
					if (error) console.error(error);

					groupMembers.splice(
						groupMembers.findIndex((members) => members.id === user.id),
						1
					);
					groupMembers = groupMembers;
				}
			}
		};
		modalStore.trigger(modal);
	}
	onMount(async () => {
		const groupMembersRequest = await supabase
			.from('group_members')
			.select(
				`
				id,
				group_id, 
				user_id, 
				user_profiles(display_name, username)
			`
			)
			.eq('group_id', group_id);
		if (groupMembersRequest.error) console.error(groupMembersRequest.error);

		groupMembers = groupMembersRequest.data ?? [];
	});
</script>

<div class="max-w-screen-lg">
	<AppBar background={'bg-surface-700'}>
		<svelte:fragment slot="lead">
			<a href={`/channels/groups/${group_id}`}>
				<span class="material-symbols-outlined"> arrow_back </span>
			</a>
		</svelte:fragment>
		<h2 class="text-lg">Ajustes del grupo</h2>
	</AppBar>
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
					{#each groupMembers as group_member (group_member.id)}
						<li>
							<Avatar
								initials={group_member.user_profiles.display_name.substring(0, 2)}
								width={'w-10'}
							/>
							<span class="flex-auto">
								{`${group_member.user_profiles.username} (${group_member.user_profiles.display_name})`}
							</span>
							<button
								class="btn-icon variant-filled-surface"
								on:click={() => (selectedUser = group_member)}
								use:popup={popupGroupMember}>⋮</button
							>
						</li>
						<div class="card p-4 w-72 shadow-xl z-10" data-popup="popupGroupMember">
							<div class="flex flex-col gap-2">
								<button type="button" class="btn variant-filled-surface">
									<span class="material-symbols-outlined"> chat </span>
									<span>Enviar un mensaje</span>
								</button>
								<button
									on:click={() => deleteUser(selectedUser)}
									type="button"
									class="btn variant-filled-surface"
								>
									<span class="material-symbols-outlined"> person_remove </span>
									<span>Expulsar del grupo</span>
								</button>
							</div>
							<div class="arrow bg-surface-700" />
						</div>
					{/each}
					<!-- ... -->
				</ul>
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="lead">
				<span class="material-symbols-outlined"> emoji_people </span>
			</svelte:fragment>
			<svelte:fragment slot="summary">Acciones de grupo</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="flex flex-col items-start gap-2">
					<button on:click={leaveGroup} type="button" class="btn variant-filled-surface">
						<span class="material-symbols-outlined"> logout </span>
						<span>Abandonar grupo</span>
					</button>
				</div>
			</svelte:fragment>
		</AccordionItem>
		<!-- ... -->
	</Accordion>
</div>
