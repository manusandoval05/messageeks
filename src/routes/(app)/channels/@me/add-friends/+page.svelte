<script lang="ts">
	import { onMount } from 'svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let data;

	$: ({ username, supabase } = data);

	const pendingInvitations = data.supabase
		.from('conversations')
		.select()
		.eq('receiver_username', data.username)
		.eq('accepted_by_receiver', false);

	async function acceptInvitation(conversationId: number) {
		console.log('running function');
		const { error } = await supabase
			.from('conversations')
			.update({
				accepted_by_receiver: true
			})
			.eq('id', conversationId);

		console.log(error);
	}
</script>

<div class="card">
	<section class="p-4 flex flex-col gap-20">
		<div class="flex flex-col gap-1">
			<div class="logo-cloud grid-cols-1 lg:!grid-cols-2 gap-0.5">
				<a class="logo-item variant-filled-primary" href="/">
					<span>
						<span class="material-symbols-outlined text-2xl"> link </span>
					</span>
					<span>Enlace de invitación</span>
				</a>
				<a class="logo-item variant-filled-primary" href="/">
					<span>
						<span class="material-symbols-outlined text-2xl"> mail </span>
					</span>
					<span>Correo</span>
				</a>

				<!-- ... -->
			</div>
			<form action="?/send_friend_request" method="post">
				<input type="hidden" name="sender_username" value={username} />
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">
						<span class="material-symbols-outlined"> diversity_3 </span>
					</div>
					<input
						type="text"
						name="receiver_username"
						required
						placeholder="Se pueden enviar invitaciones de amistad por nombre de usuario..."
					/>
					<button class="variant-filled-secondary">Añadir</button>
				</div>
			</form>
		</div>
		{#await pendingInvitations}
			<p>Cargando invitaciones...</p>
		{:then invitations}
			{#if !invitations.data}
				<h2 class="h2">No tienes solicitudes de amistad pendientes. Invita a alguien a charlar</h2>
			{:else}
				<h2 class="h2">Estas son tus solicitudes de amistad pendientes</h2>
				<ul class="list">
					{#each invitations.data ?? [] as invitation}
						<li>
							<Avatar initials={invitation.sender_username.substring(0, 2)} />
							<span class="flex-auto">{invitation.sender_username}</span>
							<button
								on:click={async () => acceptInvitation(invitation.id)}
								type="button"
								class="btn-icon btn-icon-sm variant-filled"
							>
								<span class="material-symbols-outlined"> check </span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		{/await}
	</section>
</div>
