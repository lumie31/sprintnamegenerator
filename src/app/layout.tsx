import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sprint Name Generator',
  description: 'Generate creative names for your agile sprints using AI.',
  keywords: 'sprint name generator, agile, scrum, sprint names',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="50">🎯</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var e=localStorage.getItem('theme');var d=e==='dark';document.documentElement.classList.toggle('dark',d);}catch{}})();",
          }}
        />
      </head>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
