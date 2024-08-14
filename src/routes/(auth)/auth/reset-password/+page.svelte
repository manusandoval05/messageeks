<script lang="ts">
	export let form;

	import logo from '$lib/img/logo.png';
</script>

<div class="flex min-h-full flex-col md:justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img class="mx-auto h-20 w-auto" src={logo} alt="Messageeks" />
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
			Restablece tu contraseña
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" method="POST">
			{#if form?.error}
				<aside class="alert variant-soft-error">
					<!-- Icon -->
					<div>
						<span class="material-symbols-outlined"> error </span>
					</div>
					<!-- Message -->
					<div class="alert-message">
						<h3 class="h3">Hubo un error en la petición. Intenta de nuevo</h3>
					</div>
				</aside>
			{/if}
			{#if form?.success}
				<aside class="alert variant-soft-success">
					<!-- Icon -->
					<div>
						<span class="material-symbols-outlined"> check_circle </span>
					</div>
					<!-- Message -->
					<div class="alert-message">
						<h3 class="h3">
							La petición de restablecimiento de contraseña ha sido enviada con éxito
						</h3>
						<p>Comprueba en tu correo electrónico</p>
					</div>
				</aside>
			{/if}
			<div>
				<label for="email" class="block text-sm font-medium leading-6">Correo electrónico</label>
				<div class="mt-2">
					<input
						id="email"
						placeholder="Correo de la cuenta a recuperar..."
						name="email"
						type="email"
						autocomplete="email"
						required
						class="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>
			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
					>Enviar petición</button
				>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-500">
			¿Sí recuerdas la contraseña?
			<a href="/auth/login" class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
				>Inicia sesión</a
			>
		</p>
	</div>
</div>
