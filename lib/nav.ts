import { normalize } from 'path';
import { readdir } from 'fs/promises';
import { getMarkdownData } from './mdxUtils';
import { slugify } from './slugify';
import { CONTENT_PATH } from './content';

export async function getTopLevelPages() {
	const entries = await readdir(CONTENT_PATH, { withFileTypes: true });

	const items = await Promise.all(
		entries.map(async (entry) => {
			if (!entry.isDirectory()) return;
			const { data } = await getMarkdownData(
				normalize([CONTENT_PATH, entry.name, 'index.mdx'].join('/'))
			);
			const slug = slugify(entry.name);
			return {
				label: data.title as string,
				href: `/${slug}`,
				slug,
				overview: (data.overview ?? null) as string | null,
				order: (data.order ?? -1) as number,
			};
		})
	);

	return items
		.filter((x): x is NonNullable<typeof x> => Boolean(x))
		.sort((a, b) => {
			if (a.order < b.order) return -1;
			if (a.order > b.order) return 1;
			return 0;
		});
}

export async function getNavItems() {
	const topLevelPages = await getTopLevelPages();
	return [
		{ label: 'Home', href: '/' },
		...topLevelPages.map(({ label, href }) => ({ label, href })),
	];
}
