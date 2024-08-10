<script lang="ts">
	export let form;
</script>

<form class="space-y-6" action="?/login" method="POST">
	{#if form?.error}
		<aside class="alert variant-soft-error">
			<!-- Icon -->
			<div>
				<span class="material-symbols-outlined"> error </span>
			</div>
			<!-- Message -->
			<div class="alert-message">
				<h3 class="h3">Las credenciales de inicio de sesión son inválidas</h3>
			</div>
		</aside>
	{/if}
	<div>
		<label for="email" class="block text-sm font-medium leading-6">Correo electrónico</label>
		<div class="mt-2">
			<input
				value={form?.email ?? ''}
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				required
				class="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
			/>
		</div>
	</div>

	<div>
		<div class="flex items-center justify-between">
			<label for="password" class="block text-sm font-medium leading-6">Contraseña</label>
			<div class="text-sm">
				<a href="/auth/forgotpassword" class="font-semibold text-primary-600 hover:text-primary-500"
					>¿Olvidaste constraseña?</a
				>
			</div>
		</div>
		<div class="mt-2">
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
				class="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
			/>
		</div>
	</div>

	<div>
		<button
			type="submit"
			class="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
			>Iniciar sesión</button
		>
	</div>
</form>

<p class="mt-10 text-center text-sm text-gray-500">
	¿No tienes cuenta?
	<a href="/auth/register" class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
		>Registrarse</a
	>
</p>
