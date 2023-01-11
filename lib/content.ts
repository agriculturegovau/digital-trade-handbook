import path, { normalize } from 'path';
import { existsSync } from 'fs';
import { readdir } from 'fs/promises';
import { getMarkdownData } from './mdxUtils';
import { stripMdxExtension } from './mdxUtils';
import { slugify } from './slugify';

export const CONTENT_PATH = normalize(`${process.cwd()}/content/`);

type SidebarItem = {
	label: string;
	href: string;
	items?: SidebarItem[];
};

export async function getSideNavItems(categorySlug?: string) {
	return await getFolderData(path.join(CONTENT_PATH, categorySlug ?? ''));
}

async function getFolderData(path: string): Promise<SidebarItem[]> {
	const entries = await readdir(path, { withFileTypes: true });

	const items = await Promise.all(
		entries.map(async (file) => {
			if (file.name === 'index.mdx') return null;
			const href = getHref(path, file.name);
			if (file.isDirectory()) {
				const { data } = await getMarkdownData(
					normalize(`${path}/${file.name}/index.mdx`)
				);
				return {
					href: href,
					label: data.title as string,
					order: (data.order ?? -1) as number,
					items: await getFolderData(`${path}/${file.name}`),
				};
			}
			const { data } = await getMarkdownData(normalize(`${path}/${file.name}`));
			return {
				label: data.title as string,
				href,
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

export async function getContentMarkdownData(slug: string[]) {
	const firstPath = normalize(`${CONTENT_PATH}/${slug.join('/')}.mdx`);
	if (existsSync(firstPath)) {
		return await getMarkdownData(
			normalize(`${CONTENT_PATH}/${slug.join('/')}.mdx`)
		);
	}
	const secondPath = normalize(`${CONTENT_PATH}/${slug.join('/')}/index.mdx`);
	return getMarkdownData(normalize(secondPath));
}

function getHref(path: string, fileName: string) {
	return `/${path.replace(CONTENT_PATH, '')}/${slugify(
		stripMdxExtension(normalize(fileName))
	)}`.replace('/index', '');
}

export async function getEditPath(slug: string[]) {
	if (existsSync(`${CONTENT_PATH}/${slug.join('/')}.mdx`)) {
		return `/content/${slug.join('/')}.mdx`;
	}
	return `/content/${slug.join('/')}/index.mdx`;
}

export async function getBreadcrumbs(slug: string[]) {
	const items = await Promise.all(
		slug.map(async (_, idx) => {
			const path = slug.slice(0, idx + 1);
			const { data } = await getContentMarkdownData(path);
			const label = data.title as string;
			if (idx === slug.length - 1) return { label };
			return { label, href: path.join('/') };
		})
	);
	return [{ label: 'Home', href: '/' }, ...items];
}

export async function getContentPaths() {
	const sideNavItems = await getSideNavItems();

	const flatSideNavItems = sideNavItems
		.map(flattenFolderItems)
		.flat(99) as string[];

	return flatSideNavItems.map((i) => ({
		params: { slug: i.split('/').filter(Boolean) },
	}));
}

function flattenFolderItems(item: {
	href: string;
	items?: { href: string }[];
}): string | unknown[] {
	if (Array.isArray(item.items)) {
		return [...item.items.map(flattenFolderItems), item.href];
	}
	return item.href;
}
