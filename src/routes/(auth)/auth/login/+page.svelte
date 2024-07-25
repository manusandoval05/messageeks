<script>
	export let data;
    import {Auth} from '@supabase/auth-ui-svelte';
    import {ThemeSupa} from '@supabase/auth-ui-shared'
    import {goto} from '$app/navigation'
    let {supabase, session} = data

    $: ({supabase, session} = data)
    
    $:if(session){
        console.log("onsession")
        goto("/channels/@me")
    }
    
</script>
<form class="space-y-6" action="?/login" method="POST">
    <div class="flex flex-col">
        <p>Create an account or login</p>
        <Auth
            supabaseClient={supabase}
            theme="dark"
            appearance={{
                theme:ThemeSupa,
                style:{
                    input: "width: 400px;"
                }
            }
                
            }
        
            />
    </div>
</form>