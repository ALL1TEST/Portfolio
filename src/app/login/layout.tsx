import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | CodeVirtox Admin',
  description: 'Admin sign in portal for CodeVirtox.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
