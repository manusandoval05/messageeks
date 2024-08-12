import { error, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
export const load = async ({ params, locals: { user } }) => {
	if (!user) throw redirect(303, '/');

	const supabaseSuperUser = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);

	const profileInviteRequest = await supabaseSuperUser
		.from('profile_invites')
		.select(
			`
            id,
            user_profiles(*)
        `
		)
		.eq('id', params.invite_id);

	console.log(profileInviteRequest.data);
	if (profileInviteRequest.error) throw error(400, "Couldn't process the invite");
	if (!profileInviteRequest.data.length) throw error(404, 'Could not find the invite');
};
