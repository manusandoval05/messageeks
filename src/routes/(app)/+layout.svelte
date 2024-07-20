<script lang="ts">
	import '../../app.postcss';
	import { AppShell, AppBar, AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
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
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Messageek</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailAnchor href="/@me/" selected={$page.url.pathname.startsWith("/@me")}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Conversar</span>
			</AppRailAnchor>
			<AppRailAnchor href="/groups/" selected={$page.url.pathname.startsWith("/groups")}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Grupos</span>
			</AppRailAnchor>
		</AppRail>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
