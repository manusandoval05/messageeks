export const load = async ({ locals: { supabase }, params, url }) => {
	const groupInviteIdRequest = await supabase
		.from('group_invites')
		.select('id')
		.eq('group_id', params.group_id);

	const groupMembersRequest = await supabase
		.from('group_members')
		.select(
			`
		id,
		group_id, 
		user_id, 
		user_profiles(display_name, username)
	`
		)
		.eq('group_id', params.group_id);

	console.log(groupMembersRequest.data);
	if (groupInviteIdRequest.error) {
		console.error(groupInviteIdRequest.error);
		return;
	}

	return {
		group_invite_id: groupInviteIdRequest.data[0].id,
		origin_url: url.origin
	};
};
