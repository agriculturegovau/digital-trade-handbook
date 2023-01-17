import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SectionContent } from '@ag.ds-next/react/content';
import { Card, CardInner, CardLink } from '@ag.ds-next/react/card';
import { Columns } from '@ag.ds-next/react/columns';
import { Stack } from '@ag.ds-next/react/box';
import {
	HeroCategoryBanner,
	HeroCategoryBannerTitle,
	HeroCategoryBannerSubtitle,
} from '@ag.ds-next/react/hero-banner';
import { H3 } from '@ag.ds-next/react/heading';
import { Text } from '@ag.ds-next/react/text';
import { DocumentTitle } from '../../components/DocumentTitle';
import { AppLayout } from '../../components/AppLayout';
import { EditPage } from '../../components/EditPage';
import { getNavItems } from '../../lib/nav';
import {
	getCategoryPaths,
	getCategoryMarkdownData,
	getCategoryPages,
	getCategoryEditPath,
} from '../../lib/category';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function CategoryPage({
	categoryPages,
	editPath,
	navItems,
	overview,
	title,
}: Props) {
	return (
		<>
			<DocumentTitle title={title} />
			<AppLayout navItems={navItems}>
				<HeroCategoryBanner>
					<HeroCategoryBannerTitle>{title}</HeroCategoryBannerTitle>
					<HeroCategoryBannerSubtitle>{overview}</HeroCategoryBannerSubtitle>
				</HeroCategoryBanner>
				<SectionContent>
					<Stack gap={3} alignItems="flex-start">
						<Columns as="ul" cols={{ xs: 1, sm: 2, md: 3 }}>
							{categoryPages.map(({ label, href, overview }, idx) => (
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
						<EditPage path={editPath} />
					</Stack>
				</SectionContent>
			</AppLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps<
	{
		categoryPages: Awaited<ReturnType<typeof getCategoryPages>>;
		editPath: Awaited<ReturnType<typeof getCategoryEditPath>>;
		navItems: Awaited<ReturnType<typeof getNavItems>>;
		overview: string | null;
		title: string;
	},
	{ category: string }
> = async ({ params }) => {
	const { category = '' } = params ?? {};
	const { data } = await getCategoryMarkdownData(category);
	return {
		props: {
			categoryPages: await getCategoryPages(category),
			editPath: await getCategoryEditPath(category),
			navItems: await getNavItems(),
			overview: data.overview as string | null,
			title: data.title as string,
		},
	};
};

export async function getStaticPaths() {
	const paths = await getCategoryPaths();
	return {
		paths,
		fallback: false,
	};
}
