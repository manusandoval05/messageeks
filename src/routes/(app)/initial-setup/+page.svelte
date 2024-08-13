<script lang="ts">
	import { Accordion, AccordionItem, AppBar } from '@skeletonlabs/skeleton';
	import { preferences } from '$lib/stores.js';

	export let form;

	function changeTheme(theme: string) {
		preferences.set({
			theme: theme
		});
		document.body.dataset.theme = $preferences.theme;
	}

	const themes = [
		{
			name: 'modern',
			display_name: '🤖 Modern',
			background_color: '#313276'
		},
		{
			name: 'skeleton',
			display_name: '💀 Skeleton',
			background_color: '#242c46'
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
			<h1 class="h2">Crear un perfil</h1>
		</AppBar>
		{#if form?.error}
			<aside class="alert variant-filled-error mt-2">
				<!-- Icon -->
				<!-- Message -->
				<div class="alert-message">
					<h3 class="h3">El nombre de usuario no es único</h3>
				</div>
				<!-- Actions -->
			</aside>
		{/if}
		<div class="card p-4 mt-3">
			<Accordion>
				<AccordionItem open>
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined"> manage_accounts </span>
					</svelte:fragment>
					<svelte:fragment slot="summary">Crear una cuenta</svelte:fragment>
					<svelte:fragment slot="content">
						<form method="post">
							<label class="label">
								<span>¿Cuál será el nombre de despliegue?</span>
								<input
									value={form?.display_name ?? ''}
									class="input"
									name="display-name"
									title="Input (text)"
									type="text"
									placeholder="Nombre que verán tus contactos, no tiene que ser único..."
								/>
							</label>
							<label class="label">
								<span>¿Cuál será el nombre de usuario único?</span>
								<input
									value={form?.username ?? ''}
									class="input"
									name="username"
									title="Input (text)"
									type="text"
									placeholder="Nombre de usuario único, utilizado para invitar..."
								/>
							</label>
							<button class="btn variant-filled-primary mt-2" type="submit"> Crear perfil </button>
						</form>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead"
						><span class="material-symbols-outlined"> web </span></svelte:fragment
					>
					<svelte:fragment slot="summary">¿Un poco de personalidad?</svelte:fragment>
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
