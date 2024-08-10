import { error } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, user } }) => {
	const userDetailsRequest = await supabase.from('user_profiles').select().eq('user_id', user?.id);

	if (userDetailsRequest.error) throw error(400, 'Could not load user details');

	return {
		user_details: userDetailsRequest.data[0]
	};
};
