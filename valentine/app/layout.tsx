import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Will You Be My Valentine? 💕",
    description: "A special question for a special someone",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
