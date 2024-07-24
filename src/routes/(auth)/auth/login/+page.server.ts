import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			console.log(error);
			redirect(303, '/auth/error');
		}

		redirect(303, '/channels/@me');
	}
};
export function load({ cookies }) {
	const visited = cookies.get('visited');

	cookies.set('visited', 'true', { path: '/', httpOnly: false, secure: false });
	return {
		visited
	};
}
