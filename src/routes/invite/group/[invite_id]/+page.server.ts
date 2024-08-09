import { error, redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
export const load = async ({ params, locals: { user } }) => {
	if (!user) throw redirect(300, '/');

	const supabaseSuperUser = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);

	const groupInviteRequest = await supabaseSuperUser
		.from('group_invites')
		.select()
		.eq('id', params.invite_id);

	if (groupInviteRequest.error) throw error(400, "Couldn't process the invite");

	if (!groupInviteRequest.data.length) throw error(404, "Couldn't find the invitation");

	const groupID = groupInviteRequest.data[0].group_id;

	const groupMembersRequest = await supabaseSuperUser
		.from('group_members')
		.select('user_id')
		.eq('user_id', user.id)
		.eq('group_id', groupID);

	if (groupMembersRequest.error) throw error(400, "Couldn't process the invite");

	if (!groupMembersRequest.data.length) {
		const addGroupMemberRequest = await supabaseSuperUser.from('group_members').insert({
			group_id: groupInviteRequest.data[0].group_id,
			user_id: user.id
		});

		if (addGroupMemberRequest.error) throw error(400, "Couldn't process the invite");
	}

	throw redirect(303, `/channels/groups/${groupInviteRequest.data[0].group_id}`);
};
