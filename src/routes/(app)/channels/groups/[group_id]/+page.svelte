<script lang="ts">
	import MessageInput from '$lib/Components/MessageInput.svelte';
	import { AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { constructMessageHTML } from '$lib';

	let elemChat: HTMLElement;
	let cachedUserIds: any = {};

	export let data;

	export let messageFeed: any[] = [];
	$: ({ supabase, group_id, user } = data);

	$: if (messageFeed.length) {
		(async () => {
			messageFeed?.forEach(async (message) => {
				if (cachedUserIds[message.sender_id]) return;

				const { data, error } = await supabase
					.from('user_profiles')
					.select('display_name')
					.eq('user_id', message.sender_id);

				if (error) {
					console.error(error);
					return;
				}

				cachedUserIds[message.sender_id] = data[0].display_name;
				cachedUserIds = cachedUserIds;
			});
		})();
	}

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	async function addMessage(event: any) {
		const messageValue = event.detail.text;

		const { error } = await supabase.from('group_messages').insert({
			group_id: group_id,
			content: messageValue
		});

		if (error) console.error(error);
	}
	const handleNewMessage = (payload: any) => {
		const newMessage = {
			...payload.new,
			html_content: constructMessageHTML(payload.new.content),
			host: payload.new.sender_id === user?.id,
			color: 'variant-soft-primary',
			timestamp: new Date(payload.new.created_at)
		};

		// Update the message feed
		messageFeed = [...messageFeed, payload.new];

		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	};

	onMount(async () => {
		const groupMessagesRequest = await supabase
			.from('group_messages')
			.select()
			.eq('group_id', group_id)
			.order('id', {
				ascending: true
			});

		if (groupMessagesRequest.error) {
			console.log(groupMessagesRequest.error);
			return;
		}

		messageFeed = [...messageFeed, ...groupMessagesRequest.data];

		scrollChatBottom();

		supabase
			.channel(`group_${group_id}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'group_messages',
					filter: `group_id=eq.${group_id}`
				},
				handleNewMessage
			)
			.subscribe();
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
		integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
		crossorigin="anonymous"
	/>
</svelte:head>
<div class="flex flex-col lg:max-h-[calc(100dvh-60px)] max-h-[100dvh]">
	<AppBar background={'bg-surface-700'}>
		<svelte:fragment slot="lead">
			<a class="lg:hidden flex content-center" href="/channels/@me">
				<span class="material-symbols-outlined"> arrow_back </span>
			</a>
		</svelte:fragment>
		{#await supabase.from('groups').select('name').eq('id', group_id)}
			<h5 class="text-lg">Chat</h5>
		{:then response}
			<h5 class="text-lg">{response.data ? response.data[0].name : 'Chat'}</h5>
		{/await}
	</AppBar>
	<!-- Conversation -->
	<section bind:this={elemChat} class={`p-4 overflow-y-auto space-y-4 h-full`}>
		{#each messageFeed ?? [] as bubble}
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<Avatar
					initials={cachedUserIds[bubble.sender_id]
						? cachedUserIds[bubble.sender_id].substring(0, 2)
						: ''}
					width="w-12"
				/>
				<div
					class:variant-soft={!(bubble.sender_id === user?.id)}
					class:variant-soft-primary={bubble.sender_id === user?.id}
					class="card p-4 rounded-tl-none space-y-2"
				>
					<header class="flex justify-between items-center">
						<p class="font-bold">{cachedUserIds[bubble.sender_id]}</p>
						<small class="opacity-50"
							>{new Date(bubble.created_at).toLocaleString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
								hour12: true
							})}</small
						>
					</header>
					<div>
						{@html constructMessageHTML(bubble.content)}
					</div>
				</div>
			</div>
		{/each}
	</section>
	<!-- Prompt -->

	<MessageInput on:message={addMessage} />
</div>
