<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	export let data;

	$: ({ username, supabase } = data);
	const toastStore = getToastStore();

	const toast: ToastSettings = {
		message: 'Enlace de invitación copiado con éxito. ¡Invita a alguien a unirse a Messageeks!',
		background: 'variant-filled-success'
	};
	const userInvite = `${data.url_origin}/invite/user/${data.invite_id}`;
</script>

<div class="card">
	<section class="p-4 flex flex-col gap-20">
		<div class="flex flex-col gap-1">
			<div class="logo-cloud grid-cols-1 lg:!grid-cols-2 gap-0.5">
				<button
					class="logo-item variant-filled-primary"
					on:click={() => toastStore.trigger(toast)}
					use:clipboard={userInvite}
				>
					<span>
						<span class="material-symbols-outlined text-2xl"> link </span>
					</span>
					<span>Enlace de invitación</span>
				</button>
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
						placeholder="Se puede iniciar una conversación con el nombre de usuario..."
					/>
					<button class="variant-filled-secondary">Añadir</button>
				</div>
			</form>
		</div>
	</section>
</div>
