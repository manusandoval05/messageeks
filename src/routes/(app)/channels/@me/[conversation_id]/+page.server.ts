import { error } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase, safeGetSession }}) => {
    
    const { session, user } = await safeGetSession();

    if(!user) return;

    const conversationMessagesRequest = await supabase
        .from("conversations")
        .select(`
            conversation_messages (
                id,
                created_at,
                sender_id,
                content
            )
        `)
        .eq("id", Number(params.conversation_id));

    if(conversationMessagesRequest.error) throw error(400, "Failed to load conversation");
    
    return {
        conversation_messages: conversationMessagesRequest.data[0].conversation_messages
    }
};