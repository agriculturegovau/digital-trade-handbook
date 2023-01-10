import Head from 'next/head';

export const DocumentTitle = ({ title }: { title?: string }) => (
	<Head>
		<title>
			{[title, 'Service Delivery Handbook'].filter(Boolean).join(' | ')}
		</title>
	</Head>
);
