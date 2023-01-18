import { Fragment, ReactNode } from 'react';
import { Box, Flex } from '@ag.ds-next/react/box';
import { SkipLinks } from '@ag.ds-next/react/skip-link';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

type AppLayoutProps = {
	children?: ReactNode;
	navItems: { label: string; href: string }[];
};

export const AppLayout = ({ children, navItems }: AppLayoutProps) => {
	return (
		<Fragment>
			<SkipLinks
				links={[
					{ href: '#main-content', label: 'Skip to main content' },
					{ href: '#main-nav', label: 'Skip to main navigation' },
				]}
			/>
			<Flex flexDirection="column" fontFamily="body" minHeight="100vh">
				<SiteHeader navItems={navItems} />
				<Box flexGrow={1}>{children}</Box>
				<SiteFooter navItems={navItems} />
			</Flex>
		</Fragment>
	);
};
