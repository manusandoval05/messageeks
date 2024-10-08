import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		if (password !== confirmPassword)
			return fail(400, { email, message: 'Las contraseñas no coinciden', error: true });

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/initial-setup`
			}
		});
		console.log(error);

		if (error) {
			if (error.code === 'weak_password')
				return fail(400, { email, message: 'La contraseña es muy débil', error: true });

			return fail(400, { email, message: 'El correo ya se ha registrado', error: true });
		}

		return {
			success: true
		};
	}
};
