export const load = async({ parent }) => {
    const { supabase, user, username } = await parent();

    if(!user) return;

    const userConversationsRequest = await supabase
        .from("conversations")
        .select("id, sender_username, receiver_username")
        .or(`sender_username.eq.${username},receiver_username.eq.${username}`);
    
    if(userConversationsRequest.error) return;

    return { userConversations: userConversationsRequest.data }
}