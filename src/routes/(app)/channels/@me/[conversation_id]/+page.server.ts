import { error } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase, safeGetSession }}) => {
    
    const { session, user } = await safeGetSession();

    if(!user) return;

    const conversationMessagesRequest = await supabase
        .from("conversations")
        .select(`
            accepted_by_receiver,
            sender_username,
            receiver_username,
            conversation_messages (
                id,
                created_at,
                sender_id,
                content
            )
        `)
        .eq("id", Number(params.conversation_id));

    
    if(conversationMessagesRequest.error){
        console.log(conversationMessagesRequest.error);
        throw error(400, "Failed to load conversation");
    };
    
    return {
        conversation_messages: conversationMessagesRequest.data[0].conversation_messages,
        accepted_by_receiver: conversationMessagesRequest.data[0].accepted_by_receiver,
        sender_username: conversationMessagesRequest.data[0].sender_username,
        receiver_username: conversationMessagesRequest.data[0].receiver_username, 
        conversation_id: Number(params.conversation_id),
    }
};