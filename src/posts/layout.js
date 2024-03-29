import './globals.css';
import Head from 'next/head';

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
    return (
        <html>
            <Head>
                {/* Example for including Inter font from Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" 
                    rel="stylesheet"
                />

                {/* Define metadata for SEO */}
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Head>
            <body>{children}</body>
        </html>
    );
}
