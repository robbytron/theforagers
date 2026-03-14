import type { Metadata } from 'next';
import { Fraunces, Epilogue } from 'next/font/google';
import Footer from '@/components/ui/Footer';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap',
});

const epilogue = Epilogue({
  subsets: ['latin'], weight: ['300','400','500'], variable: '--font-epilogue', display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'The Foragers — Wild Food of Britain', template: '%s | The Foragers' },
  description: 'The definitive UK foraging guide — find, identify and cook wild food in Britain.',
  metadataBase: new URL('https://theforagers.co.uk'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${epilogue.variable}`}>
      <body>
        <div style={{ overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
