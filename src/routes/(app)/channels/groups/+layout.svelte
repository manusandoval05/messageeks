<script lang="ts">
	import { Avatar, getModalStore } from '@skeletonlabs/skeleton';
	import { hideAppRail } from '$lib/stores.js';
	// Types
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	const modalStore = getModalStore();

	export let data;
	$: ({ userGroups, group_id, supabase, user } = data);

	$: if (!data.group_id) hideAppRail.set(false);
	if (!data.group_id) hideAppRail.set(false);

	const createGroupModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Crear un grupo',
		body: '¿Cuál será el nombre del grupo?',
		// Populates the input value and attributes
		value: 'Un muy genial grupo',
		valueAttr: { type: 'text', maxlength: 64, required: true },
		// Returns the updated response value
		response: async (name: string) => {
			if (!name) return;
			const createGroupRequest = await supabase
				.from('groups')
				.insert({
					name: name,
					creator_id: user?.id
				})
				.select();

			if (createGroupRequest.error) {
				console.error(createGroupRequest.error);
				return;
			}

			const addUserRequest = await supabase.from('group_members').insert({
				group_id: createGroupRequest.data[0].id,
				user_id: user?.id
			});

			if (addUserRequest.error) {
				console.error(addUserRequest.error);
				return;
			}
			const createGroupInviteRequest = await supabase.from('group_invites').insert({
				group_id: createGroupRequest.data[0].id
			});

			if (createGroupInviteRequest.error) {
				console.error(createGroupInviteRequest.error);
				return;
			}
			goto(`/channels/groups/${createGroupRequest.data?.at(0).id}`);
		}
	};
</script>

<section class="card w-full h-full">
	<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div
			class:hidden={$hideAppRail}
			class="lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30"
		>
			<!-- Header -->
			<header class="border-b border-surface-500/30 p-4">
				<input class="input" type="search" placeholder="Search..." />
			</header>
			<!-- List -->
			<div class="p-4 space-y-4 overflow-y-auto">
				<button
					on:click={() => modalStore.trigger(createGroupModal)}
					type="button"
					class="btn variant-filled"
				>
					<span class="material-symbols-outlined"> add_circle </span>
					<span>Crear un grupo</span>
				</button>

				<hr class="!border-t-2" />

				<div class="flex gap-3">
					<p>Grupos</p>
				</div>
				<div class="flex flex-col space-y-1">
					{#each userGroups ?? [] as group}
						<a
							href={`/channels/groups/${group.id}`}
							class="btn w-full flex items-center space-x-4 {group.id === Number(group_id)
								? 'variant-filled-primary'
								: 'bg-surface-hover-token'}"
						>
							<Avatar initials={group.name.substring(0, 2)} width="w-8" />
							<span class="flex-1 text-start">
								{group.name}
							</span>
						</a>
					{/each}
				</div>
			</div>
			<!-- Footer -->
			<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
		</div>
		<!-- Chat -->
		<slot />
	</div>
</section>
