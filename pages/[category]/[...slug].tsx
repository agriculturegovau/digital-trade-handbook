import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import { Prose } from '@ag.ds-next/react/prose';
import { PageContent, ContentBleed } from '@ag.ds-next/react/content';
import { Columns, Column } from '@ag.ds-next/react/columns';
import { SideNav } from '@ag.ds-next/react/side-nav';
import { Breadcrumbs } from '@ag.ds-next/react/breadcrumbs';
import { Stack } from '@ag.ds-next/react/box';
import { InpageNav } from '@ag.ds-next/react/inpage-nav';
import { getNavItems } from '../../lib/nav';
import { serializeMarkdown } from '../../lib/mdxUtils';
import { PageTitle } from '../../components/PageTitle';
import { DocumentTitle } from '../../components/DocumentTitle';
import { AppLayout } from '../../components/AppLayout';
import {
	getBreadcrumbs,
	getContentMarkdownData,
	getContentPaths,
	getEditPath,
	getSideNavItems,
} from '../../lib/content';
import { generateToc } from '../../lib/generateToc';
import { mdxComponents } from '../../components/mdxComponents';
import { EditPage } from '../../components/EditPage';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function ContentPage({
	breadcrumbs,
	editPath,
	navItems,
	overview,
	sideNav,
	source,
	title,
	toc,
}: Props) {
	const { asPath } = useRouter();
	return (
		<>
			<DocumentTitle title={title} />
			<AppLayout navItems={navItems}>
				<PageContent as="main" id="main-content">
					<Columns>
						<Column columnSpan={{ xs: 12, md: 4, lg: 3 }}>
							<ContentBleed visible={{ md: false }}>
								<SideNav
									collapseTitle="In this section"
									activePath={asPath}
									{...sideNav}
								/>
							</ContentBleed>
						</Column>
						<Column columnSpan={{ xs: 12, md: 8 }} columnStart={{ lg: 5 }}>
							<Stack gap={3} alignItems="flex-start">
								<Breadcrumbs links={breadcrumbs} />
								<PageTitle title={title} introduction={overview} />
								{toc.length > 1 ? (
									<InpageNav
										title="On this page"
										links={toc.map(({ slug, title }) => ({
											href: `#${slug}`,
											label: title,
										}))}
									/>
								) : null}
								<Prose>
									<MDXRemote {...source} components={mdxComponents} />
								</Prose>
								<EditPage path={editPath} />
							</Stack>
						</Column>
					</Columns>
				</PageContent>
			</AppLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps<
	{
		breadcrumbs: Awaited<ReturnType<typeof getBreadcrumbs>>;
		editPath: Awaited<ReturnType<typeof getEditPath>>;
		navItems: Awaited<ReturnType<typeof getNavItems>>;
		overview: string | null;
		source: Awaited<ReturnType<typeof serializeMarkdown>>;
		sideNav: {
			title: string;
			titleLink: string;
			items: Awaited<ReturnType<typeof getSideNavItems>>;
		};
		title: string;
		toc: ReturnType<typeof generateToc>;
	},
	{ category: string; slug: string[] }
> = async ({ params }) => {
	const { category, slug } = params ?? {};

	if (!(category && slug)) {
		return { notFound: true };
	}
	const slugParams = [category, ...slug];
	const [categorySlug] = slugParams;

	const {
		data: { title: categoryTitle },
	} = await getContentMarkdownData([categorySlug]);

	const { content, data } = await getContentMarkdownData(slugParams);

	return {
		props: {
			breadcrumbs: await getBreadcrumbs(slugParams),
			editPath: await getEditPath(slugParams),
			navItems: await getNavItems(),
			overview: (data.overview ?? null) as string | null,
			sideNav: {
				title: categoryTitle,
				titleLink: `/${categorySlug}`,
				items: await getSideNavItems(categorySlug),
			},
			source: await serializeMarkdown(content),
			title: data.title as string,
			toc: generateToc(content),
		},
	};
};

export async function getStaticPaths() {
	const paths = await getContentPaths();
	return {
		paths,
		fallback: false,
	};
}
