import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, user }, url }) => {
	const { data } = await supabase.from('profile_invites').select('id').eq('user_id', user?.id);

	if (data) return { invite_id: data[0].id, url_origin: url.origin };
};

export const actions = {
	send_friend_request: async ({ request, locals: { supabase, user } }) => {
		if (!user) throw error(403, 'User is not signed in');

		const data = await request.formData();
		const receiver_username = data.get('receiver_username')?.toString();
		const sender_username = data.get('sender_username')?.toString();

		const newConversationRequest = await supabase
			.from('conversations')
			.insert({
				sender_username,
				receiver_username
			})
			.select();

		if (!newConversationRequest.error) {
			throw redirect(300, `/channels/@me/${newConversationRequest.data[0].id}`);
		}
	}
};
