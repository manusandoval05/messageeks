<script lang="ts">
	import { onMount } from 'svelte';
	import { AppBar, Avatar, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { hideAppRail } from '$lib/stores.js';
	import { constructMessageHTML } from '$lib';
	import MessageInput from '$lib/Components/MessageInput.svelte';

	let cachedUserIds: any = {};

	export let data;

	const toastStore = getToastStore();

	$: ({
		conversation_messages,
		profile_id,
		supabase,
		conversation_id,
		accepted_by_receiver,
		username,
		receiver_username,
		sender_username
	} = data);
	$: conversation_messages?.sort((a, b) => a.id - b.id);
	// Begin caching usernames
	$: if (conversation_messages) {
		(async () => {
			conversation_messages?.forEach(async (message) => {
				if (cachedUserIds[message.sender_id]) return;

				const { data, error } = await supabase
					.from('user_profiles')
					.select('display_name')
					.eq('id', message.sender_id);

				if (error) {
					console.log(error);
					return;
				}

				cachedUserIds[message.sender_id] = data[0].display_name;
				cachedUserIds = cachedUserIds;
			});
		})();
	}
	$: messageFeed = conversation_messages
		? conversation_messages.map((message) => {
				return {
					...message,
					html_content: constructMessageHTML(message.content),
					host: message.sender_id === profile_id,
					color: 'variant-soft-primary',
					timestamp: new Date(message.created_at)
				};
			})
		: [];

	let elemChat: HTMLElement;

	// Messages

	const handleNewMessage = (payload: any) => {
		const newMessage = {
			...payload.new,
			html_content: constructMessageHTML(payload.new.content),
			host: payload.new.sender_id === profile_id,
			color: 'variant-soft-primary',
			timestamp: new Date(payload.new.created_at)
		};

		// Update the message feed
		messageFeed = [...messageFeed, newMessage];

		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	};
	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}
	async function addMessage(event: any) {
		const messageValue = event.detail.text;

		if (!accepted_by_receiver && receiver_username === username) {
			const { error } = await supabase
				.from('conversations')
				.update({
					accepted_by_receiver: true
				})
				.eq('id', conversation_id);
			console.log(error);
		}

		if (
			(conversation_messages?.length ?? 0 >= 5) &&
			sender_username === username &&
			!accepted_by_receiver
		) {
			const errorToast: ToastSettings = {
				message: 'No puedes enviar más mensajes hasta que te hayan respondido',
				background: 'variant-filled-error'
			};
			toastStore.trigger(errorToast);
		}

		const { error } = await supabase.from('conversation_messages').insert({
			sender_id: profile_id,
			conversation_id: conversation_id,
			content: messageValue
		});

		if (error) {
			console.error(error);
			return;
		}
	}
	// When DOM mounted, scroll to bottom
	onMount(() => {
		hideAppRail.set(true);
		scrollChatBottom();
		supabase
			.channel(`conversation_${conversation_id}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'conversation_messages',
					filter: `conversation_id=eq.${conversation_id}`
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
<div class="flex flex-col lg:max-h-[calc(100dvh-96px)] max-h-[100dvh]">
	<AppBar background={'bg-surface-700'}>
		<svelte:fragment slot="lead">
			<a class="lg:hidden flex content-center" href="/channels/@me">
				<span class="material-symbols-outlined"> arrow_back </span>
			</a>
		</svelte:fragment>
		<h5 class="text-lg">Chat</h5>
	</AppBar>
	<!-- Conversation -->
	<section bind:this={elemChat} class={`p-4 overflow-y-auto space-y-4 h-full`}>
		{#each messageFeed ?? [] as bubble (bubble.id)}
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<Avatar
					initials={cachedUserIds[bubble.sender_id]
						? cachedUserIds[bubble.sender_id].substring(0, 2)
						: ''}
					width="w-12"
				/>
				<div
					class:variant-soft={!bubble.host}
					class="card p-4 rounded-tl-none space-y-2 {bubble.host ? bubble.color : ''}"
				>
					<header class="flex justify-between items-center">
						<p class="font-bold">{cachedUserIds[bubble.sender_id]}</p>
						<small class="opacity-50"
							>{bubble.timestamp.toLocaleString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
								hour12: true
							})}</small
						>
					</header>
					<div>
						{@html bubble.html_content}
					</div>
				</div>
			</div>
		{/each}
	</section>
	<!-- Prompt -->

	<MessageInput on:message={addMessage} />
</div>
