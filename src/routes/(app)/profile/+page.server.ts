import { error, fail } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, user } }) => {
	const userDetailsRequest = await supabase.from('user_profiles').select().eq('user_id', user?.id);

	if (userDetailsRequest.error) throw error(400, 'Could not load user details');

	return {
		user_details: userDetailsRequest.data[0]
	};
};

export const actions = {
	change_username: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;

		const { error } = await supabase
			.from('user_profiles')
			.update({
				username: username
			})
			.eq('user_id', user?.id);

		if (error) console.log(error);

		if (error?.code === '23505') {
			fail(400, {
				username,
				not_unique: true
			});
		}

		if (!error) {
			return {
				success: true
			};
		}
	},
	change_display_name: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const newDisplayName = formData.get('display_name') as string;

		const { error } = await supabase
			.from('user_profiles')
			.update({
				display_name: newDisplayName
			})
			.eq('user_id', user?.id);

		if (!error) {
			return {
				success: true
			};
		}
	},
	change_password: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		if (password !== confirmPassword) {
			return fail(400, {
				mismatch: true
			});
		}

		const { error } = await supabase.auth.updateUser({
			password: password
		});

		if (!error) {
			return {
				success: true
			};
		}
	}
};
