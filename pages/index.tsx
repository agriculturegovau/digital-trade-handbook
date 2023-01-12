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
import { serializeMarkdown } from '../lib/mdxUtils';
import { getContentMarkdownData } from '../lib/content';
import { getNavItems, getTopLevelPages } from '../lib/nav';
import { mdxComponents } from '../components/mdxComponents';
import { EditPage } from '../components/EditPage';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function HomePage({ navItems, source, topLevelPages }: Props) {
	return (
		<>
			<DocumentTitle />
			<AppLayout navItems={navItems}>
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
					<Stack gap={3}>
						<Columns as="ul" cols={{ xs: 1, sm: 2, md: 2 }}>
							{topLevelPages.map(({ label, slug, overview }, idx) => (
								<Card as="li" key={idx} shadow clickable>
									<CardInner>
										<Stack gap={1}>
											<H3>
												<CardLink href={`/${slug}`}>{label}</CardLink>
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
						<EditPage path="/content/index.mdx" />
					</Stack>
				</SectionContent>
			</AppLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps<{
	navItems: Awaited<ReturnType<typeof getNavItems>>;
	source: Awaited<ReturnType<typeof serializeMarkdown>>;
	topLevelPages: Awaited<ReturnType<typeof getTopLevelPages>>;
}> = async () => {
	const navItems = await getNavItems();
	const topLevelPages = await getTopLevelPages();
	const { content } = await getContentMarkdownData(['index']);
	return {
		props: {
			navItems,
			source: await serializeMarkdown(content),
			topLevelPages,
		},
	};
};
