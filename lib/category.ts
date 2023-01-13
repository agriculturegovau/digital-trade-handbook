import path, { normalize } from 'path';
import { readdir } from 'fs/promises';
import { getMarkdownData, stripMdxExtension } from './mdxUtils';
import { slugify } from './slugify';
import { getTopLevelPages } from './nav';
import { CONTENT_PATH, CONTENT_EDIT_PATH } from './content';

export async function getCategoryPages(categorySlug: string) {
	const basePath = path.join(CONTENT_PATH, categorySlug);
	const entries = await readdir(basePath, { withFileTypes: true });

	const items = await Promise.all(
		entries.map(async (entry) => {
			if (entry.name === 'index.mdx') return;
			const entryPath = entry.isDirectory()
				? path.join(basePath, entry.name, 'index.mdx')
				: path.join(basePath, entry.name);
			const { data } = await getMarkdownData(entryPath);
			return {
				label: data.title as string,
				href: `/${categorySlug}/${slugify(stripMdxExtension(entry.name))}`,
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

export async function getCategoryEditPath(categorySlug: string) {
	return [CONTENT_EDIT_PATH, categorySlug, 'index.mdx'].join('/');
}

export async function getCategoryMarkdownData(categorySlug: string) {
	const filePath = normalize(
		path.join(CONTENT_PATH, categorySlug, 'index.mdx')
	);
	return await getMarkdownData(filePath);
}

export async function getCategoryPaths() {
	const topLevelPages = await getTopLevelPages();
	return topLevelPages.map(({ slug }) => ({
		params: { category: slug },
	}));
}
