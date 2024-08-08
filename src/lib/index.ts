// place files you want to import through the `$lib` alias in this folder.
import katex from 'katex';
import AsciiMathParser from 'asciimath2tex';

function escapeHTML(html: string) {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
function markdownToHtml(markdown: string) {
	let html = markdown;

	// Convert headers
	html = html.replace(/^###### (.*$)/gim, '<h6 class="h6">$1</h6>');
	html = html.replace(/^##### (.*$)/gim, '<h5 class="h5">$1</h5>');
	html = html.replace(/^#### (.*$)/gim, '<h4 class="h4">$1</h4>');
	html = html.replace(/^### (.*$)/gim, '<h3 class="h3">$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2 class="h2">$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1 class="h1">$1</h1>');

	// Convert bold and italic
	html = html.replace(/\*\*\*(.*)\*\*\*/gim, '<b><i>$1</i></b>');
	html = html.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>');
	html = html.replace(/\*(.*)\*/gim, '<i>$1</i>');

	// Convert plain links
	html = html.replace(/\bhttps?:\/\/\S+\b/gim, '<a class="anchor" href="$&">$&</a>');

	// Convert markdown links
	html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

	// Convert blockquotes
	html = html.replace(/^> (.*$)/gim, '<blockquote class="blockquote">$1</blockquote>');

	// Convert unordered lists
	html = html.replace(/^\* (.*$)/gim, '<ul class="list-disc pl-4"><li>$1</li></ul>');
	html = html.replace(/<\/ul>\n<ul class="list-disc pl-4">/gim, '\n');

	// Convert ordered lists
	html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
	html = html.replace(/<\/ol>\n<ol>/gim, '\n');

	// Convert line breaks
	// html = html.replace(/\n/gim, '<br>');

	return html.trim();
}

export function constructMessageHTML(text: string) {
	const parser = new AsciiMathParser();
	// Required to only extract the math expression
	const mathExpressionRegex = /\$\$?.*?\$\$?/g;

	// If matched it means it is a text expression between $$$$

	const matches = text.match(mathExpressionRegex);

	// Split with the regex and only keep the non-latex text
	const splitText = text.split(mathExpressionRegex);
	const escapedTextFragments = splitText.map((fragment) => escapeHTML(fragment));
	// After escaping, it is safe to transform the mardown into HTML
	const markdownToHTMLFragments = escapedTextFragments.map((fragment) => markdownToHtml(fragment));

	const expressionsHTML = matches
		? matches.map((match) => {
				const asciiMathRegex = /\$(.*?)\$/g;
				const texRegex = /\$\$(.*?)\$\$/g;

				let mathExpression = match;

				mathExpression = mathExpression.replace(texRegex, (_, expression) => {
					return katex.renderToString(expression, {
						displayMode: true,
						throwOnError: false
					});
				});

				mathExpression = mathExpression.replace(asciiMathRegex, (_, expression) => {
					const tex = parser.parse(expression);
					return katex.renderToString(tex, {
						displayMode: true,
						throwOnError: false
					});
				});

				return mathExpression;
			})
		: [];

	const finalString = markdownToHTMLFragments.reduce((accumulator, fragment, index) => {
		return accumulator + fragment + (expressionsHTML[index] ?? '');
	}, '');

	return finalString;
}
