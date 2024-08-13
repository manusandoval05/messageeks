import { fail, error as errorFunction, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();

		const username = formData.get('username') as string;
		const display_name = formData.get('display-name') as string;

		const { error } = await supabase.from('user_profiles').insert({
			user_id: user?.id,
			username,
			display_name
		});

		if (error?.code === '23505') {
			return fail(400, {
				username,
				display_name,
				error: true
			});
		}

		const createProfileInviteRequest = await supabase.from('profile_invites').insert({
			user_id: user?.id
		});

		if (createProfileInviteRequest.error) throw errorFunction(400, 'Failed to create user invite');

		redirect(303, '/channels/@me');
	}
};
