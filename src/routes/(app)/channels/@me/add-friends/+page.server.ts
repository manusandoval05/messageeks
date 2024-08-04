import { error } from '@sveltejs/kit';


export const actions = {
    send_friend_request: async({ request, locals: {supabase, user} }) => {

        if(!user) throw error(403, "User is not signed in");

        const data = await request.formData();
        const receiver_username = data.get("receiver_username")?.toString();
        const sender_username  = data.get("sender_username")?.toString();

        console.log(receiver_username); 
        console.log(sender_username);

        const newConversationRequest = await supabase
            .from("conversations")
            .insert({
                sender_username, 
                receiver_username
            });
        
        console.log(newConversationRequest.error);
    }
}