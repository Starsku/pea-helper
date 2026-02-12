import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GainResult, PEA } from '@/lib/engine/types';

// Design strict respectant le template CFONB
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#000',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  // Section layout
  section: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  sectionTitle: {
    backgroundColor: '#F0F0F0',
    padding: 3,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    textAlign: 'center',
  },
  grid2Col: {
    flexDirection: 'row',
  },
  col: {
    width: '50%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  colLast: {
    width: '50%',
    padding: 5,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: '60%',
    fontWeight: 'bold',
  },
  value: {
    width: '40%',
  },
  // Table styles
  table: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderBottomWidth: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 25,
    alignItems: 'center',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 18,
    alignItems: 'center',
  },
  cell: {
    padding: 2,
    borderRightWidth: 1,
    borderRightColor: '#000',
    height: '100%',
    justifyContent: 'center',
  },
  cellLast: {
    padding: 2,
    height: '100%',
    justifyContent: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  // Column Widths for the main table
  wPeriod: { width: '15%' },
  wBase: { width: '15%' },
  wRate: { width: '10%' },
  wComp: { width: '10%' }, // CRDS, CSG...
  wTotal: { width: '10%' },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 7,
    textAlign: 'center',
    color: '#666',
    borderTopWidth: 0.5,
    borderTopColor: '#999',
    paddingTop: 5,
  }
});

interface PDFGeneratorProps {
  result: GainResult;
  input: PEA;
}

const PEABordereauPDF = ({ result, input }: PDFGeneratorProps) => {
  const formatDate = (d: string | Date) => d ? new Date(d).toLocaleDateString('fr-FR') : '';
  const formatEuro = (val: number | undefined) => (val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  // Helper to get tax by name for a period
  const getTax = (period: any, key: string) => {
    return period.taxes[key] || 0;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BORDEREAU D'INFORMATIONS DE TRANSFERT DE PLAN D'EPARGNE EN ACTIONS</Text>

        {/* SECTION 1: INTERMEDIAIRES */}
        <View style={styles.section}>
          <View style={styles.grid2Col}>
            <View style={styles.col}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5, textDecoration: 'underline' }}>INTERMEDIAIRE DONNEUR D'ORDRE</Text>
              <Text>Dénomination : PEA HELPER SIMULATOR</Text>
              <Text>Adresse : ....................................................................</Text>
              <Text>Code établissement : ...............................................</Text>
            </View>
            <View style={styles.colLast}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5, textDecoration: 'underline' }}>INTERMEDIAIRE BENEFICIAIRE</Text>
              <Text>Dénomination : ...........................................................</Text>
              <Text>Adresse : ....................................................................</Text>
              <Text>Code établissement : ...............................................</Text>
            </View>
          </View>
        </View>

        {/* SECTION 2: CARACTERISTIQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CARACTERISTIQUES GENERALES DU PLAN TRANSFERE</Text>
          <View style={styles.grid2Col}>
            <View style={styles.col}>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Date d'ouverture :</Text>
                <Text style={styles.value}>{formatDate(input.dateOuverture)}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Numéro du plan :</Text>
                <Text style={styles.value}>................................</Text>
              </View>
            </View>
            <View style={styles.colLast}>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Total versements :</Text>
                <Text style={styles.value}>{formatEuro(input.totalVersements)}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Valeur au retrait :</Text>
                <Text style={styles.value}>{formatEuro(input.valeurLiquidative)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 3: TABLEAU DETAILLE DES CONTRIBUTIONS */}
        <View style={{ marginTop: 5 }}>
          <Text style={[styles.sectionTitle, { borderWidth: 1, borderColor: '#000', borderBottomWidth: 0 }]}>
            ELEMENTS DE CALCUL D'ASSIETTES DES CONTRIBUTIONS SOCIALES
          </Text>
          <View style={styles.table}>
            {/* Header 1 */}
            <View style={styles.tableHeader}>
              <View style={[styles.cell, { width: '12%' }]}><Text>Période</Text></View>
              <View style={[styles.cell, { width: '12%' }]}><Text>Assiette</Text></View>
              <View style={[styles.cell, { width: '8%' }]}><Text>CRDS 0,5%</Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text>CSG 3,4%</Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text>CSG 7,5%</Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text>CSG 8,2%</Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text>CSG 9,2%</Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text>PS 2%</Text></View>
              <View style={[styles.cell, { width: '8%' }]}><Text>PS 2,2%</Text></View>
              <View style={[styles.cell, { width: '8%' }]}><Text>Autres*</Text></View>
              <View style={[styles.cellLast, { width: '15%' }]}><Text>Total Dû</Text></View>
            </View>

            {/* Data Rows */}
            {result.detailsParPeriode && result.detailsParPeriode.map((p, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={[styles.cell, { width: '12%', fontSize: 6 }]}><Text>{p.periodLabel}</Text></View>
                <View style={[styles.cell, { width: '12%' }, styles.textRight]}><Text>{formatEuro(p.gain)}</Text></View>
                <View style={[styles.cell, { width: '8%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'crds'))}</Text></View>
                <View style={[styles.cell, { width: '7%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'csg34'))}</Text></View>
                <View style={[styles.cell, { width: '7%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'csg75'))}</Text></View>
                <View style={[styles.cell, { width: '7%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'csg82'))}</Text></View>
                <View style={[styles.cell, { width: '7%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'csg92'))}</Text></View>
                <View style={[styles.cell, { width: '7%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'ps2'))}</Text></View>
                <View style={[styles.cell, { width: '8%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'ps22'))}</Text></View>
                <View style={[styles.cell, { width: '8%' }, styles.textRight]}><Text>{formatEuro(getTax(p, 'caps') + getTax(p, 'crsa') + getTax(p, 'psol'))}</Text></View>
                <View style={[styles.cellLast, { width: '15%' }, styles.textRight, { fontWeight: 'bold' }]}><Text>{formatEuro(p.taxes.total)}</Text></View>
              </View>
            ))}

            {/* Total Row */}
            <View style={[styles.tableRow, { backgroundColor: '#F0F0F0', fontWeight: 'bold' }]}>
              <View style={[styles.cell, { width: '12%' }]}><Text>TOTAL</Text></View>
              <View style={[styles.cell, { width: '12%' }, styles.textRight]}><Text>{formatEuro(result.assietteGain)}</Text></View>
              <View style={[styles.cell, { width: '8%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '7%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '8%' }]}><Text></Text></View>
              <View style={[styles.cell, { width: '8%' }]}><Text></Text></View>
              <View style={[styles.cellLast, { width: '15%' }, styles.textRight]}><Text>{formatEuro(result.montantPS)}</Text></View>
            </View>
          </View>
          <Text style={{ fontSize: 6, marginTop: 2 }}>* Autres incluent : CAPS (0,35% ou 1,1%), CRSA (1,1%), PSOL (2%) selon les périodes.</Text>
        </View>

        {/* SECTION 4: SYNTHESE */}
        <View style={[styles.section, { marginTop: 15 }]}>
          <Text style={styles.sectionTitle}>SYNTHESE FINANCIERE</Text>
          <View style={styles.grid2Col}>
            <View style={styles.col}>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Assiette de gain calculée :</Text>
                <Text style={styles.value}>{formatEuro(result.assietteGain)}</Text>
              </View>
            </View>
            <View style={styles.colLast}>
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Total prélèvements sociaux :</Text>
                <Text style={styles.value}>{formatEuro(result.montantPS)}</Text>
              </View>
              <View style={[styles.fieldRow, { marginTop: 5, paddingTop: 5, borderTopWidth: 1 }]}>
                <Text style={[styles.label, { fontSize: 10 }]}>NET PERÇU :</Text>
                <Text style={[styles.value, { fontSize: 10, fontWeight: 'bold' }]}>{formatEuro(result.netVendeur)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Fait à .........................................., le {formatDate(new Date())}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ width: '50%' }}><Text>Cachet de l'établissement</Text></View>
            <View style={{ width: '50%' }}><Text>Signature du titulaire</Text></View>
          </View>
        </View>

        <Text style={styles.footer}>
          Document généré par PEA Helper - Conforme à la communication CFONB n° 20190030 du 04/09/2019.
          Le Comité Français d'Organisation et de Normalisation Bancaires définit le format standard de transfert de PEA entre établissements.
        </Text>
      </Page>
    </Document>
  );
};

export default PEABordereauPDF;
