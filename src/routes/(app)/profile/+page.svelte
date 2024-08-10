<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<div class="container">
	<Accordion>
		<AccordionItem open>
			<svelte:fragment slot="lead">(icon)</svelte:fragment>
			<svelte:fragment slot="summary">Mi cuenta</svelte:fragment>
			<svelte:fragment slot="content">
				<form action="?/change-display-name" method="post">
					<label class="label">
						<span>Cambiar nombre de despliegue</span>
						<input
							class="input"
							name="display-name"
							title="Input (text)"
							type="text"
							placeholder="input text"
						/>
					</label>
				</form>
				<form action="?/change-username" method="post">
					<label class="label">
						<span>Cambiar nombre de usuario único</span>
						<input
							class="input"
							name="username"
							title="Input (text)"
							type="text"
							placeholder="input text"
						/>
					</label>
				</form>
				<hr />
				<form action="?/change-password" method="post">
					<label class="label">
						<span>Nueva contraseña</span>
						<input
							class="input"
							name="password"
							title="Input (text)"
							type="text"
							placeholder="input text"
						/>
					</label>
					<label class="label">
						<span>Confirmar nueva contraseña</span>
						<input
							class="input"
							name="confirm-password"
							title="Input (text)"
							type="text"
							placeholder="input text"
						/>
					</label>
				</form>
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="lead">(icon)</svelte:fragment>
			<svelte:fragment slot="summary">Ajustes de aplicación</svelte:fragment>
			<svelte:fragment slot="content">(content)</svelte:fragment>
		</AccordionItem>
		<!-- ... -->
	</Accordion>
</div>
