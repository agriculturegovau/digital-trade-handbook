import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { Stack } from '@ag.ds-next/react/box';
import { SectionContent } from '@ag.ds-next/react/content';
import { H3 } from '@ag.ds-next/react/heading';
import { Text } from '@ag.ds-next/react/text';
import {
	HeroBanner,
	HeroBannerSubtitle,
	HeroBannerTitle,
} from '@ag.ds-next/react/hero-banner';
import { Card, CardInner, CardLink } from '@ag.ds-next/react/card';
import { Columns } from '@ag.ds-next/react/columns';
import { Prose } from '@ag.ds-next/react/prose';
import { tokens } from '@ag.ds-next/react/core';
import { TextLink } from '@ag.ds-next/react/text-link';
import { AppLayout } from '../components/AppLayout';
import { DocumentTitle } from '../components/DocumentTitle';
import { mdxComponents } from '../components/mdxComponents';
import { EditPage } from '../components/EditPage';
import { serializeMarkdown } from '../lib/mdxUtils';
import { getNavItems, getTopLevelPages } from '../lib/nav';
import { getHomeMarkdownData, getHomeEditPath } from '../lib/home';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function HomePage({
	editPath,
	navItems,
	source,
	topLevelPages,
}: Props) {
	return (
		<>
			<DocumentTitle />
			<AppLayout navItems={navItems}>
				<main id="main-content">
					<HeroBanner>
						<HeroBannerTitle>Taking Farmers to Markets service</HeroBannerTitle>
						<HeroBannerSubtitle>
							This handbook is by the Taking Farmers to Markets service teams.
							This service is part of the Australian Government{' '}
							<TextLink href="https://www.agriculture.gov.au/">
								Department of Agriculture, Fisheries and Forestry
							</TextLink>
							.
						</HeroBannerSubtitle>
					</HeroBanner>
					<SectionContent>
						<Stack gap={3} alignItems="flex-start">
							<Columns as="ul" cols={{ xs: 1, sm: 2 }}>
								{topLevelPages.map(({ label, href, overview }, idx) => (
									<Card as="li" key={idx} shadow clickable>
										<CardInner>
											<Stack gap={1}>
												<H3>
													<CardLink href={href}>{label}</CardLink>
												</H3>
												{overview ? <Text as="p">{overview}</Text> : null}
											</Stack>
										</CardInner>
									</Card>
								))}
							</Columns>
							<Prose maxWidth={tokens.maxWidth.bodyText}>
								<MDXRemote {...source} components={mdxComponents} />
							</Prose>
							<EditPage path={editPath} />
						</Stack>
					</SectionContent>
				</main>
			</AppLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps<{
	editPath: ReturnType<typeof getHomeEditPath>;
	navItems: Awaited<ReturnType<typeof getNavItems>>;
	source: Awaited<ReturnType<typeof serializeMarkdown>>;
	topLevelPages: Awaited<ReturnType<typeof getTopLevelPages>>;
}> = async () => {
	const navItems = await getNavItems();
	const topLevelPages = await getTopLevelPages();
	const { content } = await getHomeMarkdownData();
	return {
		props: {
			editPath: getHomeEditPath(),
			navItems,
			source: await serializeMarkdown(content),
			topLevelPages,
		},
	};
};
