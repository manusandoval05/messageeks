export const load = async({ parent }) => {
    const { supabase, user } = await parent();

    if(!user) return;

    const usernameRequest = await supabase
        .from("user_profiles")
        .select("display_name, username")
        .eq("user_id", user.id);

    
    if(usernameRequest.error) return

    return { 
        username: usernameRequest.data[0].username as string,
        display_name: usernameRequest.data[0].display_name as string
    }
}