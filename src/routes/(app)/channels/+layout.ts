export const load = async({ parent }) => {
    const { supabase, user } = await parent();

    if(!user) return { display_name: ""};

    const { data, error } = await supabase
        .from("user_profiles")
        .select("display_name")
        .eq("user_id", user.id);

    
    if(error) return { display_name: ""}

    return { display_name: data[0].display_name }
}