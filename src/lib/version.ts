export const VERSION = {
  current: '4.0.0',
  date: '12/02/2026',
  changelog: [
    {
      version: '4.0.0',
      date: '12/02/2026',
      changes: [
        'Réimplémentation complète du moteur (Replay Chronologique)',
        'Gestion multi-retraits : calcul du prorata capital/gain sur chaque retrait passé',
        'Gestion dynamique de l\'érosion du capital (Capital Restant)',
        'Nouvelle Timeline d\'événements (Versements, Retraits passés, VL Pivots)',
        'Nouvelle interface de Transparence expliquant l\'érosion du capital',
        'PDF mis à jour avec les cumuls de versements et de bases historiques',
        'Migration vers Tailwind CSS v4'
      ]
    },
    {
      version: '3.2.0',
      date: '12/02/2026',
      changes: [
        'Ajout du drill-down dans les détails de calcul',
        'Visualisation détaillée par contribution (CSG, CRDS, PS, etc.) pour chaque période',
        'Amélioration de l\'interface des étapes de calcul'
      ]
    },
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
    }
  ]
}
