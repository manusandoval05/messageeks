<script lang="ts">
    import { onMount } from "svelte";
    import { Avatar } from "@skeletonlabs/skeleton";


    interface MessageFeed {
		id: number;
		host: boolean;
		avatar: number;
		name: string;
		timestamp: string;
		message: string;
		color: string;
	}

	let cachedUserIds: any = {}
	
	export let data;

	$: ({ conversation_messages, profile_id, supabase } = data); 
	$: conversation_messages?.sort((a, b) => a.id - b.id);
	// Begin caching usernames
	$: if(conversation_messages){
		(async() => {
			conversation_messages?.forEach(async(message) => {
				if(cachedUserIds[message.sender_id]) return; 
				
			
				const { data, error } = await supabase
					.from("user_profiles")
					.select("display_name")
					.eq("id", message.sender_id);
				
				if(error) return;

				cachedUserIds[message.sender_id] = data[0].display_name;
				cachedUserIds = cachedUserIds;
			});
		})();
	}
	$: messageFeed1 = conversation_messages?.map(message => {
		return {
			...message,
			host: message.sender_id === profile_id,
			color: 'variant-soft-primary',
			
		}
	});




    let elemChat: HTMLElement;
    // Messages
	let messageFeed: MessageFeed[] = [
		{
			id: 0,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:30pm',
			message: 'Text',
			color: 'variant-soft-primary'
		},
		{
			id: 1,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:45pm',
			message: 'Text',
			color: 'variant-soft-primary'
		},
		{
			id: 2,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:50pm',
			message: 'Text',
			color: 'variant-soft-primary'
		},
		{
			id: 3,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:52pm',
			message: 'text',
			color: 'variant-soft-primary'
		}
	];
	let currentMessage = '';

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function addMessage(): void {
		const newMessage = {
			id: messageFeed.length,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: currentMessage,
			color: 'variant-soft-primary'
		};
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	// When DOM mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom();
	});
</script>

<div class="grid grid-row-[1fr_auto]">
    <!-- Conversation -->
    <section bind:this={elemChat} class="max-h-[500px] p-4 overflow-y-auto space-y-4">
        {#each messageFeed1 ?? [] as bubble}
            {#if bubble.host === false}
                <div class="grid grid-cols-[auto_1fr] gap-2">
                    <Avatar initials={cachedUserIds[bubble.sender_id] ? cachedUserIds[bubble.sender_id].substring(0, 2) : ""}  width="w-12" />
                    <div class="card p-4 variant-soft rounded-tl-none space-y-2">
                        <header class="flex justify-between items-center">
                            <p class="font-bold">{cachedUserIds[bubble.sender_id]}</p>
                            <small class="opacity-50">{bubble.created_at}</small>
                        </header>
                        <p>{bubble.content}</p>
                    </div>
                </div>
            {:else}
                <div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar initials={cachedUserIds[bubble.sender_id] ? cachedUserIds[bubble.sender_id].substring(0, 2) : ""} width="w-12" />
                    <div class="card p-4 rounded-tr-none space-y-2 {bubble.color}">
                        <header class="flex justify-between items-center">
                            <p class="font-bold">{cachedUserIds[bubble.sender_id]}</p>
                            <small class="opacity-50">{bubble.created_at}</small>
                        </header>
                        <p>{bubble.content}</p>
                    </div>
                </div>
            {/if}
        {/each}
    </section>
    <!-- Prompt -->
    <section class="border-t border-surface-500/30 p-4">
        <div
            class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
        >
            <button class="input-group-shim">+</button>
            <textarea
                bind:value={currentMessage}
                class="bg-transparent border-0 ring-0"
                name="prompt"
                id="prompt"
                placeholder="Write a message..."
                rows="1"
                on:keydown={onPromptKeydown}
            ></textarea>
            <button
                class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
                on:click={addMessage}
            >
				<span class="material-symbols-outlined">
					send
				</span>
            </button>
        </div>
    </section>
</div>