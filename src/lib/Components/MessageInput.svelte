<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let elemMessageTextArea: HTMLTextAreaElement;

	function addMessage() {
		if (!elemMessageTextArea.value) return;

		dispatch('message', {
			text: elemMessageTextArea.value
		});
		// Don't really like resetting the input before knowing the text has been sent. But, oh well
		elemMessageTextArea.value = '';
		adjustTextAreaSize();
	}

	function insertAutocompleteText(textToInsert: string) {
		const cursorPosition = elemMessageTextArea.selectionStart;
		console.log(cursorPosition);

		const textBeforeCursor = elemMessageTextArea.value.substring(0, cursorPosition);
		const textAfterCursor = elemMessageTextArea.value.substring(
			cursorPosition,
			elemMessageTextArea.value.length
		);

		elemMessageTextArea.value = textBeforeCursor + textToInsert + textAfterCursor;

		const newCursorPosition = cursorPosition + 1;

		elemMessageTextArea.focus();
		elemMessageTextArea.setSelectionRange(newCursorPosition, newCursorPosition);
	}

	function adjustTextAreaSize() {
		elemMessageTextArea.style.height = 'auto';
		elemMessageTextArea.style.height = `${elemMessageTextArea.scrollHeight}px`;
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		adjustTextAreaSize();
		if (['Enter'].includes(event.code) && event.shiftKey) {
			event.preventDefault();
			elemMessageTextArea.value += '\n';
			adjustTextAreaSize();
			return;
		}

		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}
</script>

<section class="border-t border-surface-500/30 p-4">
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
		<button class="input-group-shim">+</button>
		<textarea
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
			on:click={addMessage}
			class={elemMessageTextArea?.value ? 'variant-filled-primary' : 'input-group-shim'}
		>
			<span class="material-symbols-outlined"> send </span>
		</button>
	</div>
	<div class="btn-group variant-ringed-surface mt-1">
		<button on:click={() => insertAutocompleteText('{}')}>&lbrace;</button>
		<button on:click={() => insertAutocompleteText('}')}>&rbrace;</button>
		<button on:click={() => insertAutocompleteText('$$')}>$</button>
		<button on:click={() => insertAutocompleteText('\\')}>\</button>
	</div>
</section>
