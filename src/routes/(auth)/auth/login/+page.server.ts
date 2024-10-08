import { redirect } from '@sveltejs/kit';

export const actions = {
    login: async({ request, locals: { supabase }}) => {
        const formData = await request.formData();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signInWithPassword({ email, password }); 

        console.log(error);

        if(error){
            return {
                email,
                error: true
            } 
        }

        redirect(303, "/channels/@me");
    }
}