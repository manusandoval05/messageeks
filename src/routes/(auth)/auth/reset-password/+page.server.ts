export const actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/update-password`
		});
		if (error) return { error: true };

		return {
			success: true
		};
	}
};
