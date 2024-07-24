<form class="space-y-6" action="?/login" method="POST">
	<div>
		<label for="email" class="block text-sm font-medium leading-6">Email address</label>
		<div class="mt-2">
			<input
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
			<label for="password" class="block text-sm font-medium leading-6">Password</label>
			<div class="text-sm">
				<a href="/forgotpassword" class="font-semibold text-primary-600 hover:text-primary-500"
					>Forgot password?</a
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
			>Sign in</button
		>
	</div>
</form>

<p class="mt-10 text-center text-sm text-gray-500">
	Not a member?
	<a href="/auth/register" class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
		>Start a 14 day free trial</a
	>
</p>
