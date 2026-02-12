export function formatCurrency(amount: number): string {
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Remplacer l'espace insécable de fr-FR par l'apostrophe
  return formatted.replace(/\s/g, "'") + " EUR";
}
