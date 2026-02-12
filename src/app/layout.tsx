import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PEA Helper - Calculateur de Fiscalité",
  description: "Calculez les prélèvements sociaux sur vos retraits de PEA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
