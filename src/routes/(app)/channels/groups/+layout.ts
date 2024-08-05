export const load = async({ parent, params }) => {
    const { supabase, user  } = await parent();

    if(!user) return {error: "No session"};

    const userGroupsRequest = await supabase
        .from("groups")
        .select(`
            id,
            name,
            group_members(
                user_id
            )   
        `)
        .eq("group_members.user_id", user.id );
    
    if(userGroupsRequest.error){
        console.log(userGroupsRequest.error);
        return;
    }
    return {
        userGroups: userGroupsRequest.data,
        activeGroupId: params.group_id
    }
    

}