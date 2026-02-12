import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GainResult, PEA } from '@/lib/engine/types';

// Design strict respectant le standard CFONB
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#000',
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 20,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#EEEEEE',
    fontWeight: 'bold',
    minHeight: 25,
    alignItems: 'center',
  },
  cellLabel: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  cellValue: {
    width: 120,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'right',
  },
  subTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textDecoration: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
  indent: {
    paddingLeft: 15,
  }
});

interface PDFGeneratorProps {
  result: GainResult;
  input: PEA;
}

const PEABordereauPDF = ({ result, input }: PDFGeneratorProps) => {
  const formatEuro = (val: number | undefined) => {
    const s = (val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `[ ${s.replace(/\s/g, "'")} ]`;
  };

  const getVLAt = (dateStr: string) => {
    const found = input.events?.find(e => e.date === dateStr && (e.type === 'VL_PIVOT' || e.type === 'RETRAIT'));
    return found ? (found.vl || 0) : 0;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ELEMENTS DE CALCUL D'ASSIETTES DES CONTRIBUTIONS SOCIALES</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.cellLabel}><Text>Description</Text></View>
            <View style={styles.cellValue}><Text>Valeur</Text></View>
          </View>

          {/* CRDS Section */}
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1 }}>
            <Text style={styles.bold}>Pour calcul de la CRDS à 0.50%</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Valeur liquidative au 31/01/1996</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(getVLAt('1996-01-31'))}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Versements espérés depuis le 01/02/1996</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.capitalInitial)}</Text></View>
          </View>
          
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 5 }}>
            <Text style={styles.bold}>CRDS Globale (Multi-retraits)</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Cumul des versements remboursés lors des retraits passés</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.cumulVersementsRembourses)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Cumul des bases d'imposition déterminées lors des retraits passés</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.cumulRetraitsPasses - result.cumulVersementsRembourses)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>CRDS sur retrait actuel</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.repartitionTaxes?.crds)}</Text></View>
          </View>

          {/* CSG Section */}
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 10 }}>
            <Text style={styles.bold}>Pour calcul de la CSG</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Valeur liquidative au 31/12/1996</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(getVLAt('1996-12-31'))}</Text></View>
          </View>
          
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 5 }}>
            <Text style={styles.bold}>Synthèse des Stocks (Mode Chronologique)</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Capital Initial (Versements)</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.capitalInitial)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Capital Restant Net (après retraits passés)</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.capitalRestant)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Assiette de gain du retrait actuel</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.assietteGain)}</Text></View>
          </View>

          {/* PS Section */}
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 10 }}>
            <Text style={styles.bold}>Contributions Sociales Totales (CSG, CRDS, PS, CAPS...)</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Total des prélèvements calculés sur ce retrait</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.montantPS)}</Text></View>
          </View>

        </View>

        <View style={{ marginTop: 40, borderTopWidth: 1, paddingTop: 10 }}>
          <Text style={styles.bold}>SYNTHESE DU RETRAIT</Text>
          <Text>Montant Brut du Retrait : {result.montantRetrait.toFixed(2)} €</Text>
          <Text>Dont part de Capital (exonérée) : {(result.montantRetrait - result.assietteGain).toFixed(2)} €</Text>
          <Text>Dont part de Gain (taxable) : {result.assietteGain.toFixed(2)} €</Text>
          <Text>Total Contributions Sociales : {result.montantPS.toFixed(2)} €</Text>
          <View style={{ marginTop: 10, padding: 10, backgroundColor: '#EEE' }}>
            <Text style={[styles.bold, { fontSize: 12 }]}>NET A PERCEVOIR : {result.netVendeur.toFixed(2)} €</Text>
          </View>
        </View>

        <Text style={{ position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 7, textAlign: 'center', color: '#666' }}>
          Document généré par PEA Helper v4.1.0 - Replay Chronologique de l'historique du plan avec pivots automatiques.
        </Text>
      </Page>
    </Document>
  );
};

export default PEABordereauPDF;
