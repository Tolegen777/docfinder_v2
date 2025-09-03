import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import {Header} from "../components/App/Header/Header";
import {Footer} from "../components/App/Footer/Footer";
import {Providers} from "@/root/Providers/Providers";
import {ReactNode} from "react";
import {FloatingWhatsApp} from "@/shared/ui/FloatingWhatsApp/FloatingWhatsApp";
import {LocationProvider} from "@/components/LocationProvider/LocationProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Добавляем Roboto
const roboto = Roboto({
    weight: ['400', '500', '700'],
    subsets: ['latin', 'cyrillic'],
    variable: '--font-roboto',
});

export const metadata: Metadata = {
    title: "Docfinder",
    description: "Врачи которым вы доверяете",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            {/* Google Tag Manager */}
            <Script
                id="gtm-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-WVRMX72F');
                    `,
                }}
            />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
        >
        {/* Google Tag Manager (noscript) */}
        <noscript>
            <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-WVRMX72F"
                height="0"
                width="0"
                style={{display: 'none', visibility: 'hidden'}}
            />
        </noscript>

        <Providers>
            <Header />
            {children}
            <Footer/>
        </Providers>
        <FloatingWhatsApp />
        <LocationProvider/>
        </body>
        </html>
    );
}
