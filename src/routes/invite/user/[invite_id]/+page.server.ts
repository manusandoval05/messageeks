import { error, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
export const load = async ({ params, locals: { user, supabase } }) => {
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

	if (profileInviteRequest.error) throw error(400, "Couldn't process the invite");
	if (!profileInviteRequest.data.length) throw error(404, 'Could not find the invite');

	const currentUserProfileRequest = await supabaseSuperUser
		.from('user_profiles')
		.select('username')
		.eq('user_id', user.id);

	if (currentUserProfileRequest.error) throw error(400, "Couldn't process the invite");

	const currentUsername = currentUserProfileRequest.data[0].username;

	const userConversationsRequest = await supabase
		.from('conversations')
		.select('id, sender_username, receiver_username')
		.or(
			`sender_username.eq.${profileInviteRequest.data[0].user_profiles.username},receiver_username.eq.${profileInviteRequest.data[0].user_profiles.username}`
		);

	if (userConversationsRequest.error) throw error(400, "Couldn't process the invite");

	const conversationWithTargetUser = userConversationsRequest.data.filter(
		(conversation) =>
			conversation.receiver_username === currentUsername ||
			conversation.sender_username === currentUsername
	);

	if (conversationWithTargetUser.length) {
		throw redirect(303, `/channels/@me/${conversationWithTargetUser[0].id}`);
	} else {
		const createConversationRequest = await supabase
			.from('conversations')
			.insert({
				sender_username: currentUsername,
				receiver_username: profileInviteRequest.data[0].user_profiles.username
			})
			.select();

		if (createConversationRequest.error) throw error(400, "Couldn't create the conversation");

		throw redirect(303, `/channels/@me/${createConversationRequest.data[0].id}`);
	}
};
