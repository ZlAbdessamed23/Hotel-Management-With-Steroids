import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/Providers";
import { Inter, Roboto, Kdam_Thmor_Pro , Poppins , Sniglet } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const roboto = Roboto({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const kdamThmor = Kdam_Thmor_Pro({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-kdam',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})


const sniglet = Sniglet({
  subsets: ['latin'],
  weight: ['400', '800'], // Available weights for Sniglet
  variable: '--font-sniglet',
})

export const metadata: Metadata = {
  title: "HotyVerse - Système de Gestion Hôtelière",
  description: "Découvrez notre système de gestion hôtèlière complet et gérer efficacement toutes couvre tous les  services et les resources de votre établissement , Optimiser vos opérations , Améliorez l'éxpérience client avec notre solution innovante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} ${kdamThmor.variable} ${poppins.variable} ${sniglet.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
