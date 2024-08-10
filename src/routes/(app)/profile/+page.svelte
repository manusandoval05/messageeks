<script lang="ts">
	import { Accordion, AccordionItem, AppBar } from '@skeletonlabs/skeleton';

	export let data;
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
		<div class="card p-4 mt-3">
			<Accordion>
				<AccordionItem open>
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
									value={data.user_details.username}
									class="input"
									name="username"
									title="Input (text)"
									type="text"
									placeholder="Nombre de usuario único, utilizado para invitar..."
								/>
							</label>
							<button class="btn variant-filled-primary mt-2" type="submit"> Guardar </button>
						</form>
						<hr />
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
					<svelte:fragment slot="summary">Ajustes de aplicación</svelte:fragment>
					<svelte:fragment slot="content">(content)</svelte:fragment>
				</AccordionItem>
				<!-- ... -->
			</Accordion>
		</div>
	</div>
</div>
