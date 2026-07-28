import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("host") ?? "localhost:3000";
  const protocol =
    incomingHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "tai'kingdom — Tiny Kingdom RTS",
    description:
      "A bilingual browser RTS where you gather resources, command your troops, and defend the kingdom.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "tai'kingdom",
      description: "Command. Gather. Defend.",
      type: "website",
      images: [{ url: imageUrl, width: 1672, height: 939, alt: "tai'kingdom" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "tai'kingdom",
      description: "Command. Gather. Defend.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
