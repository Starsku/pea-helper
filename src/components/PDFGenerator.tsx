import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { GainResult, PEA } from '@/lib/engine/types';

// Enregistrement d'une police plus moderne (optionnel, sinon utilise Helvetica par défaut)
// Font.register({ family: 'Helvetica', fontWeight: 'normal' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  date: {
    fontSize: 9,
    color: '#64748b',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4f46e5',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  gridItem: {
    width: '50%',
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 8,
  },
  tableCellRight: {
    margin: 5,
    fontSize: 8,
    textAlign: 'right',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
  },
  summaryBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalNet: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#15803d',
    marginTop: 5,
    paddingTop: 5,
    borderTop: 1,
    borderTopColor: '#bbf7d0',
  }
});

interface PDFGeneratorProps {
  result: GainResult;
  input: PEA;
}

const PEABordereauPDF = ({ result, input }: PDFGeneratorProps) => {
  const generationDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>BORDEREAU DE RETRAIT PEA</Text>
            <Text style={styles.date}>Généré le {generationDate}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>PEA HELPER V3</Text>
            <Text style={{ fontSize: 8 }}>Simulateur de contributions sociales</Text>
          </View>
        </View>

        {/* Caractéristiques du Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Caractéristiques du Plan</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Date d'ouverture</Text>
              <Text style={styles.value}>
                {new Date(input.dateOuverture).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Ancienneté</Text>
              <Text style={styles.value}>{result.agePEA} ans</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Valeur Liquidative Totale</Text>
              <Text style={styles.value}>{input.valeurLiquidative.toLocaleString('fr-FR')} €</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Cumul des Versements</Text>
              <Text style={styles.value}>{input.totalVersements.toLocaleString('fr-FR')} €</Text>
            </View>
          </View>
        </View>

        {/* Détail du Retrait */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Opération de Retrait</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Montant Brut demandé</Text>
              <Text style={styles.value}>{result.montantRetrait.toLocaleString('fr-FR')} €</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Assiette de gain imposable</Text>
              <Text style={styles.value}>{result.assietteGain.toLocaleString('fr-FR')} €</Text>
            </View>
          </View>
        </View>

        {/* Ventilation par période */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Ventilation des Gains et Taxes</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Période</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellRight}>Gain</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellRight}>Taux PS</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellRight}>Prélèvement</Text></View>
            </View>
            
            {result.detailsParPeriode ? (
              result.detailsParPeriode.map((p, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{p.periodLabel}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCellRight}>{p.gain.toFixed(2)} €</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCellRight}>{p.rates.total}%</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCellRight}>{p.taxes.total.toFixed(2)} €</Text></View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>Unique (Post-2018)</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellRight}>{result.assietteGain.toFixed(2)} €</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellRight}>17.2%</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellRight}>{result.montantPS.toFixed(2)} €</Text></View>
              </View>
            )}
          </View>
        </View>

        {/* Détail Contributions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Détail des Contributions Sociales</Text>
          <View style={styles.grid}>
            {Object.entries(result.repartitionTaxes || {}).map(([key, val]) => (
              val > 0 && key !== 'total' && (
                <View key={key} style={{ width: '33%', marginBottom: 5 }}>
                  <Text style={styles.label}>{key.toUpperCase()}</Text>
                  <Text style={{ fontSize: 9 }}>{val.toFixed(2)} €</Text>
                </View>
              )
            ))}
          </View>
        </View>

        {/* Synthèse Financière */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Montant du retrait brut :</Text>
            <Text>{result.montantRetrait.toLocaleString('fr-FR')} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ color: '#dc2626' }}>Total des prélèvements sociaux :</Text>
            <Text style={{ color: '#dc2626' }}>- {result.montantPS.toLocaleString('fr-FR')} €</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalNet]}>
            <Text>MONTANT NET À PERCEVOIR :</Text>
            <Text>{result.netVendeur.toLocaleString('fr-FR')} €</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Document généré à titre indicatif par PEA Helper. 
          Les calculs respectent la réglementation fiscale en vigueur (taux historiques vs taux forfaitaire).
        </Text>
      </Page>
    </Document>
  );
};

export default PEABordereauPDF;
