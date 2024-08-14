import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const password = formData.get('password') as string;

		const { error } = await supabase.auth.updateUser({
			password
		});

		if (!error) throw redirect(303, '/');
	}
};
