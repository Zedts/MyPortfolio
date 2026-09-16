import type { Metadata } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';

import './globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/animations/CustomCursor';
import Preloader from '@/components/animations/Preloader';
import ParticleBackground from '@/components/animations/ParticleBackground';
import ScrollProgressIndicator from '@/components/common/ScrollProgressIndicator';
import HashScrollHandler from '@/components/common/HashScrollHandler';
import AdminShortcut from '@/components/admin/AdminShortcut';
import AdminLoginDialog from '@/components/admin/AdminLoginDialog';
import { getSettings } from '@/lib/services/settings-service';

const antonFont = Anton({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-anton',
});

const robotoFlex = Roboto_Flex({
    weight: ['100', '400', '500', '600', '700', '800'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-roboto-flex',
});

export const metadata: Metadata = {
    title: 'Royyan Hikmal Kautsar - Portfolio',
    description: 'Personal portfolio of Royyan Hikmal Kautsar',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSettings().catch(() => null);
    const socialLinks = settings?.socialLinks;
    const email = settings?.email;

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${antonFont.variable} ${robotoFlex.variable} antialiased bg-background text-foreground`}
                suppressHydrationWarning
            >
                <HashScrollHandler />
                <Navbar socialLinks={socialLinks} email={email} />
                <main>{children}</main>
                <Footer settings={settings} />
                <CustomCursor />
                <Preloader />
                <ScrollProgressIndicator />
                <ParticleBackground />
                <AdminShortcut />
                <AdminLoginDialog />
            </body>
        </html>
    );
}
