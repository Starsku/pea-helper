export const VERSION = {
  current: '4.2.0',
  date: '12/02/2026',
  changelog: [
    {
      version: '4.2.0',
      date: '12/02/2026',
      changes: [
        'Fix UX : Empêcher le "Submit on Enter" intempestif sur le formulaire.',
        'Fix Timeline : Correction du focus lors de l\'édition des dates dans la timeline.',
        'Amélioration : Historique complet des versions scrollable.',
      ]
    },
    {
      version: '4.1.1',
      date: '12/02/2026',
      changes: [
        'Rétablissement des VL pivots automatiques selon la date d\'ouverture et séparation claire de la timeline des mouvements.',
        'Incrémentation de version pour forcer le déploiement v4.1.1.'
      ]
    },
    {
      version: '4.1.0',
      date: '12/02/2026',
      changes: [
        'Automatisation des VL Pivots : génération automatique selon la date d\'ouverture',
        'Séparation UI : Timeline des mouvements (Versements/Retraits) vs Champs VL Pivots fixes',
        'Simplification de l\'expérience utilisateur (RETOUR V3.2 UX)',
        'Mise à jour du PDF pour supporter les VL pivots automatiques'
      ]
    },
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
