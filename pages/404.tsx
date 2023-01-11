import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { H1 } from '@ag.ds-next/react/heading';
import { Text } from '@ag.ds-next/react/text';
import { TextLink } from '@ag.ds-next/react/text-link';
import { PageContent } from '@ag.ds-next/react/content';
import { Stack } from '@ag.ds-next/react/box';
import { AppLayout } from '../components/AppLayout';
import { DocumentTitle } from '../components/DocumentTitle';
import { getNavItems } from '../lib/nav';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function NotFoundPage({ navItems }: Props) {
	return (
		<>
			<DocumentTitle title="Error 404" />
			<AppLayout navItems={navItems}>
				<PageContent as="main" id="main-content">
					<Stack gap={1.5}>
						<H1>Page not found</H1>
						<Text as="p" fontSize="md">
							Check the web address is correct or go back to the{' '}
							<TextLink href="/">Home page</TextLink>.
						</Text>
						<Text>Error code: 404</Text>
					</Stack>
				</PageContent>
			</AppLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps<{
	navItems: Awaited<ReturnType<typeof getNavItems>>;
}> = async () => {
	const navItems = await getNavItems();
	return {
		props: {
			navItems,
		},
	};
};
