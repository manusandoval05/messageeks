<script lang="ts">
	export let form;
	import '../../app.postcss';
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
			<div>
				<label for="password" class="block text-sm font-medium leading-6">Correo electrónico</label>
				<div class="mt-2">
					<input
						id="password"
						placeholder="Ingresa nueva contraseña"
						name="password"
						type="password"
						autocomplete="new-password"
						required
						class="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>
			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
					>Restablecer contraseña</button
				>
			</div>
		</form>
	</div>
</div>
