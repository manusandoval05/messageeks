<script lang="ts">
	import { onMount } from 'svelte';
	import { Avatar, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let data;

	$: ({ username, supabase } = data);
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
						placeholder="Se puede iniciar una conversación con el nombre de usuario..."
					/>
					<button class="variant-filled-secondary">Añadir</button>
				</div>
			</form>
		</div>
	</section>
</div>
