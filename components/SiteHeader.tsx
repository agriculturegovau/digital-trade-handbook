import { useRouter } from 'next/router';
import { Logo } from '@ag.ds-next/react/ag-branding';
import { Stack } from '@ag.ds-next/react/box';
import { Header } from '@ag.ds-next/react/header';
import { MainNav } from '@ag.ds-next/react/main-nav';

export const SiteHeader = ({
	navItems,
}: {
	navItems: { label: string; href: string }[];
}) => {
	const { asPath } = useRouter();
	return (
		<Stack palette="dark">
			<Header
				background="bodyAlt"
				logo={<Logo />}
				heading="Taking Farmers to Markets"
				subline="Service Delivery Handbook"
			/>
			<MainNav id="main-nav" activePath={asPath} items={navItems} />
		</Stack>
	);
};
