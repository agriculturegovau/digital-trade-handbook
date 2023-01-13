import { normalize } from 'path';
import { getMarkdownData } from './mdxUtils';
import { CONTENT_EDIT_PATH, CONTENT_PATH } from './content';

export async function getHomeMarkdownData() {
	const basePath = normalize(`${CONTENT_PATH}/index.mdx`);
	return getMarkdownData(normalize(basePath));
}

export function getHomeEditPath() {
	return [CONTENT_EDIT_PATH, 'index.mdx'].join('/');
}
