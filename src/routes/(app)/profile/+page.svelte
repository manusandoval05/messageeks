<script lang="ts">
	import { Accordion, AccordionItem, AppBar } from '@skeletonlabs/skeleton';

	export let data;

	export let form;

	function changeTheme(theme: string) {
		document.body.dataset.theme = theme;
	}

	const themes = [
		{
			name: 'skeleton',
			display_name: '💀 Skeleton',
			background_color: '#242c46'
		},
		{
			name: 'modern',
			display_name: '🤖 Modern',
			background_color: '#313276'
		},
		{
			name: 'seafoam',
			display_name: '🧜‍♀️ Seafoam',
			background_color: '#126668'
		},
		{
			name: 'sahara',
			display_name: '🏜️ Sahara',
			background_color: '#6b2631'
		},
		{
			name: 'gold-nouveau',
			display_name: '💫 Gold Nouveau',
			background_color: '#120b18'
		},
		{
			name: 'wintry',
			display_name: '🌨️ Wintry',
			background_color: '#111827'
		},
		{
			name: 'rocket',
			display_name: '🚀 Rocket',
			background_color: '#313944'
		},
		{
			name: 'vintage',
			display_name: '📺 Vintage',
			background_color: '#1f1b18'
		},
		{
			name: 'hamlindigo',
			display_name: '👔 Hamlindigo',
			background_color: '#1f1b18'
		},
		{
			name: 'crimson',
			display_name: '⭕ Crimson',
			background_color: '#15171f'
		}
	];
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
</svelte:head>

<div class="flex justify-center">
	<div class="container">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/channels/@me"><span class="material-symbols-outlined"> arrow_back </span></a>
			</svelte:fragment>
			<h1 class="h2">Ajustes</h1>
		</AppBar>
		{#if form?.success}
			<aside class="alert variant-filled-success mt-2">
				<!-- Icon -->
				<!-- Message -->
				<div class="alert-message">
					<h3 class="h3">{form.message}</h3>
				</div>
				<!-- Actions -->
			</aside>
		{/if}
		<div class="card p-4 mt-3">
			<Accordion>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined"> manage_accounts </span>
					</svelte:fragment>
					<svelte:fragment slot="summary">Mi cuenta</svelte:fragment>
					<svelte:fragment slot="content">
						<form action="?/change_display_name" method="post">
							<label class="label">
								<span>Cambiar nombre de despliegue</span>
								<input
									value={data.user_details.display_name}
									class="input"
									name="display-name"
									title="Input (text)"
									type="text"
									placeholder="Nombre que verán tus contactos, no tiene que ser único..."
								/>
							</label>
							<button class="btn variant-filled-primary mt-2" type="submit"> Guardar </button>
						</form>
						<form action="?/change_username" method="post">
							<label class="label">
								<span>Cambiar nombre de usuario único</span>
								<input
									value={form?.not_unique ? form.username : data.user_details.username}
									class="input"
									name="username"
									title="Input (text)"
									type="text"
									placeholder="Nombre de usuario único, utilizado para invitar..."
								/>
							</label>
							<button class="btn variant-filled-primary mt-2" type="submit"> Guardar </button>
						</form>
						<hr class="!border-t-4" />
						<form action="?/change_password" method="post">
							<label class="label">
								<span>Nueva contraseña</span>
								<input
									class="input"
									name="password"
									title="Input (text)"
									type="text"
									placeholder="Nueva contraseña..."
								/>
							</label>
							<label class="label mt-2">
								<span>Confirmar nueva contraseña</span>
								<input
									class="input"
									name="confirm-password"
									title="Input (text)"
									type="text"
									placeholder="Confirmar nueva contraseña"
								/>
							</label>
							<button class="btn variant-filled-primary mt-2" type="submit"> Guardar </button>
						</form>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead"
						><span class="material-symbols-outlined"> web </span></svelte:fragment
					>
					<svelte:fragment slot="summary">Ajustes de la aplicación</svelte:fragment>
					<svelte:fragment slot="content">
						<h4 class="h4">Tema</h4>
						<div
							class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-3"
						>
							{#each themes as theme}
								<button
									on:click={() => changeTheme(theme.name)}
									style="background-color: {theme.background_color};"
									class="snap-start shrink-0 card py-20 w-40 md:w-80 text-center"
									>{theme.display_name}</button
								>
							{/each}
						</div>
					</svelte:fragment>
				</AccordionItem>
				<!-- ... -->
			</Accordion>
		</div>
	</div>
</div>
