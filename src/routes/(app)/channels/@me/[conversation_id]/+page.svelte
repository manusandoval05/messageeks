<script lang="ts">
	import { onMount } from 'svelte';
	import { AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { hideAppRail } from '$lib/stores.js';
	import katex from 'katex';

	let cachedUserIds: any = {};

	export let data;

	$: ({ conversation_messages, profile_id, supabase, conversation_id } = data);
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
	let elemMessageTextArea: HTMLTextAreaElement;

	// Messages

	let currentMessage = '';

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

		// Clear prompt
		if (newMessage.host) currentMessage = '';
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	};
	function constructMessageHTML(text: string) {
		// Required to only extract the math expression
		const groupedMathExpressionRegex = /\$\$(.*?)\$\$/g;
		const mathExpressionRegex = /\$\$.*?\$\$/g;

		const matches = [...text.matchAll(groupedMathExpressionRegex)];

		// Split with the regex and only keep the non-latex text
		const splitText = text.split(mathExpressionRegex);

		const escapedTextFragments = splitText.map((fragment) => escapeHTML(fragment));

		const expressionsHTML = matches.map((match) => {
			const mathExpression = match[1];

			const HTMLElement = katex.renderToString(mathExpression, {
				throwOnError: false,
				displayMode: true
			});

			return HTMLElement;
		});

		const finalString = escapedTextFragments.reduce((accumulator, fragment, index) => {
			return accumulator + fragment + (expressionsHTML[index] ?? '');
		}, '');

		return finalString;
	}

	function adjustTextAreaSize() {
		elemMessageTextArea.style.height = 'auto';
		elemMessageTextArea.style.height = `${elemMessageTextArea.scrollHeight}px`;
	}

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}
	function escapeHTML(html: string) {
		return html
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	async function addMessage() {
		const { error } = await supabase.from('conversation_messages').insert({
			sender_id: profile_id,
			conversation_id: conversation_id,
			content: currentMessage
		});

		if (error) {
			console.error(error);
			return;
		}
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		adjustTextAreaSize();
		if (['Enter'].includes(event.code) && event.shiftKey) {
			event.preventDefault();
			currentMessage += '\n';
			adjustTextAreaSize();
			return;
		}

		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	// When DOM mounted, scroll to bottom
	onMount(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)');
		if (mediaQuery.matches) {
			hideAppRail.set(false);
		} else {
			hideAppRail.set(true);
		}
		mediaQuery.addEventListener('change', (event) => {
			if (event.matches) {
				hideAppRail.set(false);
			} else {
				hideAppRail.set(true);
			}
		});
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
<div class="grid grid-row-[auto_1fr] lg:max-h-[calc(100dvh-60px)] max-h-[100dvh]">
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
		{#each messageFeed ?? [] as bubble}
			{#if bubble.host === false}
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar
						initials={cachedUserIds[bubble.sender_id]
							? cachedUserIds[bubble.sender_id].substring(0, 2)
							: ''}
						width="w-12"
					/>
					<div class="card p-4 variant-soft rounded-tl-none space-y-2">
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
			{:else}
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar
						initials={cachedUserIds[bubble.sender_id]
							? cachedUserIds[bubble.sender_id].substring(0, 2)
							: ''}
						width="w-12"
					/>
					<div class="card p-4 rounded-tl-none space-y-2 {bubble.color}">
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
			{/if}
		{/each}
	</section>
	<!-- Prompt -->
	<section class="border-t border-surface-500/30 p-4">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
			<button class="input-group-shim">+</button>
			<textarea
				bind:value={currentMessage}
				bind:this={elemMessageTextArea}
				on:input={adjustTextAreaSize}
				on:keydown={onPromptKeydown}
				class="bg-transparent border-0 ring-0 resize-none h-10 max-h-[200px] lg:max-h-[50dvh]"
				name="prompt"
				id="prompt"
				placeholder="Write a message..."
				rows="1"
			></textarea>
			<button
				class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
				on:click={addMessage}
			>
				<span class="material-symbols-outlined"> send </span>
			</button>
		</div>
	</section>
</div>
