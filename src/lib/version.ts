export const VERSION = {
  current: '4.3.1',
  date: '12/02/2026',
  changelog: [
    {
      version: '4.3.1',
      date: '12/02/2026',
      changes: [
        'Branding : Nouveau design du titre principal "Moderne SaaS" avec dégradé et icône Zap.',
        'Déploiement : Incrémentation forcée pour assurer la visibilité des dernières mises à jour.',
      ]
    },
    {
      version: '4.3.0',
      date: '12/02/2026',
      changes: [
        'Historique Fiscal : Nouveau tableau récapitulatif des taux en bas de page.',
        'Info-bulles : Ajout de précisions sur les termes techniques (VL, Prélèvements).',
      ]
    },
    {
      version: '4.2.8',
      date: '12/02/2026',
      changes: [
        'Vulgarisation : Ajout d\'info-bulles sur le terme "VL" (Valeur Liquidative) pour plus de clarté.',
        'Harmonisation : Validation du formatage x\'xxx.00 EUR sur l\'ensemble de l\'interface.',
      ]
    },
    {
      version: '4.2.7',
      date: '12/02/2026',
      changes: [
        'Alignement au pixel près : La colonne "Versions" est désormais parfaitement alignée avec le titre du formulaire principal.',
        'Ajustement vertical : Correction du décalage (flottement trop bas) observé sur grand écran.',
      ]
    },
    {
      version: '4.2.6',
      date: '12/02/2026',
      changes: [
        'Correction Alignement : Alignement parfait de la colonne des versions avec le formulaire sur PC.',
        'Validation stricte : Tous les montants (y compris VL pivots) sont obligatoires pour le calcul.',
        'Initialisation : Versement initial créé par défaut et non supprimable.',
        'Responsive : Amélioration du comportement sticky de la barre latérale.',
      ]
    },
    {
      version: '4.2.4',
      date: '12/02/2026',
      changes: [
        'Harmonisation du formatage monétaire : séparateur de milliers (\') et 2 décimales.',
        'Remplacement du symbole € par le texte EUR sur toute l\'application et le PDF.',
      ]
    },
    {
      version: '4.2.2',
      date: '12/02/2026',
      changes: [
        'Réintégration de l\'historique complet (v1.0.0 à v2.x.x).',
        'Amélioration de la visibilité du changelog (scrolling infini).',
      ]
    },
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
    },
    {
      version: '2.x.x',
      date: '11/02/2026',
      changes: [
        'Correction du taux 2026 (18.6%) suite aux annonces budgétaires.',
        'Ajout de la transparence des calculs (première ébauche).',
        'Amélioration de la précision du moteur de strates.'
      ]
    },
    {
      version: '2.0.0',
      date: '10/02/2026',
      changes: [
        'Introduction des taux historiques de prélèvements sociaux (1996-2025).',
        'Moteur de calcul par strates (méthode de la balance de capitaux).',
        'Gestion des périodes de taux proportionnellement à la durée de détention.'
      ]
    },
    {
      version: '1.0.0',
      date: '08/02/2026',
      changes: [
        'Calculateur de base PEA.',
        'Application de la Flat Tax à 17.2%.',
        'Interface minimaliste de saisie.'
      ]
    }
  ]
}
