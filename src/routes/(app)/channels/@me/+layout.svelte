<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { hideAppRail } from '$lib/stores.js';
	// Types
	interface Person {
		id: number;
		avatar: number;
		name: string;
	}

	export let data;
	$: ({ userConversations, username, activeConversationId } = data);

	$: if (!activeConversationId) hideAppRail.set(false);
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
				<a href="/channels/@me/add-friends" class="btn variant-filled">
					<span class="material-symbols-outlined"> add_circle </span>
					<span>Agregar contacto</span>
				</a>

				<hr class="!border-t-2" />
				<div class="flex gap-3">
					<p>Contactos</p>
				</div>
				<div class="flex flex-col space-y-1">
					{#each userConversations ?? [] as conversation}
						<a
							href={`/channels/@me/${conversation.id}`}
							class="btn w-full flex items-center space-x-4 {conversation.id ===
							Number(activeConversationId)
								? 'variant-filled-primary'
								: 'bg-surface-hover-token'}"
						>
							{#if !conversation.sender_username || !conversation.receiver_username}
								<Avatar initials={'DU'} width="w-8" />
								<span class="flex-1 text-start"> Deleted User </span>
							{:else}
								<Avatar
									initials={conversation.sender_username === username
										? conversation.receiver_username.substring(0, 2)
										: conversation.sender_username.substring(0, 2)}
									width="w-8"
								/>
								<span class="flex-1 text-start">
									{conversation.sender_username === username
										? conversation.receiver_username.slice(0, -5)
										: conversation.sender_username.slice(0, -5)}
								</span>
							{/if}
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
