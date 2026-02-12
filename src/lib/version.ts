export const VERSION = {
  current: '3.1.0',
  date: '12/02/2026',
  changelog: [
    {
      version: '3.1.0',
      date: '12/02/2026',
      changes: [
        'PDF strictement conforme au standard CFONB 2019',
        'Réinitialisation complète du formulaire (incluant date)',
        'Nouveau layout avec colonne version à droite',
        'Nettoyage du titre (suppression des badges colorés)',
        'Optimisation du moteur de calcul pour les assiettes vides'
      ]
    },
    {
      version: '3.0.0',
      date: '12/02/2026',
      changes: [
        'Génération et téléchargement du bordereau PDF',
        'Section "Comment ce résultat a été calculé ?" avec détails pas à pas',
        'Affichage transparent de la logique de calcul'
      ]
    },
    {
      version: '2.0.0',
      date: '12/02/2026',
      changes: [
        'Gestion complète des taux historiques depuis 1996',
        'Ventilation détaillée par contribution (CSG, CRDS, PS, CAPS, CRSA, PSOL)',
        'Correction CSG 2026 (passage de 17.2% à 18.6%)',
        'Interface adaptative pour les vieux PEA'
      ]
    }
  ]
}
