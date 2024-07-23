import { redirect, error as errorHelper } from '@sveltejs/kit'

export const load = async({ locals: { supabase, user}}) => {
    if(!user) throw redirect(303, "/auth/login");

    const { error } = await supabase
        .auth.signOut();

    if(error){
        console.log(error);
        throw errorHelper(400, "Failed to log out");
    };

    throw redirect(303, "/auth/login");
}