<script lang="ts">
	import '../../../app.postcss';
	import { AppShell, AppBar, AppRail, AppRailAnchor, AppRailTile, Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let currentTile = 0;
	export let data;

	$: ({ supabase, display_name } = data); 
</script>
<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</svelte:head>
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Messageeks</strong>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailAnchor href="/channels/@me/" selected={$page.url.pathname.startsWith("/channels/@me")}>
				<svelte:fragment slot="lead">
					<span class="material-symbols-outlined">
						person
					</span>
				</svelte:fragment>
				<span>Conversar</span>
			</AppRailAnchor>
			<AppRailAnchor href="/channels/groups/" selected={$page.url.pathname.startsWith("channels/groups")}>
				<svelte:fragment slot="lead">
					<span class="material-symbols-outlined">
						groups
					</span>
				</svelte:fragment>
				<span>Grupos</span>
			</AppRailAnchor>
			<svelte:fragment slot="trail">
				<AppRailTile bind:group={currentTile} name="profile-tile" value={NaN}>
					<div class="flex justify-center">
						<Avatar
							border="border-4 border-surface-300-600-token hover:!border-primary-500"
							cursor="cursor-pointer"
							initials={ display_name?.substring(0, 2)}
						/>
					</div>
				</AppRailTile>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
