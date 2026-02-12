import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GainResult, PEA, HistoricalVL } from '@/lib/engine/types';

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
    const found = input.vlsHistoriques?.find(v => v.date === dateStr);
    return found ? found.vl : 0;
  };

  const renderSection = (title: string, rates: { label: string, date: string, valKey?: keyof GainResult['repartitionTaxes'] }[]) => (
    <View style={{ marginTop: 15 }}>
      <Text style={styles.bold}>{title}</Text>
      {rates.map((r, i) => (
        <View key={i} style={styles.tableRow}>
          <View style={styles.cellLabel}>
            <Text style={styles.indent}>{r.label}</Text>
          </View>
          <View style={styles.cellValue}>
            <Text>{formatEuro(getVLAt(r.date))}</Text>
          </View>
        </View>
      ))}
    </View>
  );

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
            <View style={styles.cellValue}><Text>{formatEuro(0)}</Text></View>
          </View>
          
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 5 }}>
            <Text style={styles.bold}>CRDS Globale</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Cumul hors plus-values des capitaux retirés</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(0)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Cumul des bases d'imposition déterminées lors des retraits</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(0)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>CRDS Taux FG (0,50% 1/1/2018)</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.repartitionTaxes?.crds)}</Text></View>
          </View>

          {/* CSG Section */}
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 10 }}>
            <Text style={styles.bold}>Pour calcul de la CSG à 3,4%</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Valeur liquidative au 31/12/1996</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(getVLAt('1996-12-31'))}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Versements espérés depuis le 01/01/1997</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(0)}</Text></View>
          </View>

          {/* ... Other CSG Rates ... */}
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 5 }}>
            <Text style={styles.bold}>CSG Globale</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Cumul hors plus-values des capitaux retirés</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(0)}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}>
              <Text style={styles.indent}>Cumul des bases d'imposition déterminées lors des retraits pour :</Text>
              <Text style={[styles.indent, { paddingLeft: 30 }]}>CSG à 3,4%</Text>
              <Text style={[styles.indent, { paddingLeft: 30 }]}>CSG à 7,5%</Text>
              <Text style={[styles.indent, { paddingLeft: 30 }]}>CSG à 8,2%</Text>
              <Text style={[styles.indent, { paddingLeft: 30 }]}>CSG à 9,2%</Text>
              <Text style={[styles.indent, { paddingLeft: 30 }]}>CSG à 10,6%</Text>
            </View>
            <View style={styles.cellValue}>
              <Text style={{ marginTop: 12 }}>{formatEuro(0)}</Text>
              <Text>{formatEuro(0)}</Text>
              <Text>{formatEuro(0)}</Text>
              <Text>{formatEuro(0)}</Text>
              <Text>{formatEuro(0)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>CSG Taux FG (9,20% 1/1/2019)</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.repartitionTaxes?.csg)}</Text></View>
          </View>

          {/* PS Section */}
          <View style={{ backgroundColor: '#F9F9F9', padding: 5, borderBottomWidth: 1, marginTop: 10 }}>
            <Text style={styles.bold}>Prélèvements Sociaux (PS, CAPS, PSOL...)</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.cellLabel}><Text style={styles.indent}>Total des prélèvements calculés</Text></View>
            <View style={styles.cellValue}><Text>{formatEuro(result.montantPS)}</Text></View>
          </View>

        </View>

        <View style={{ marginTop: 40, borderTopWidth: 1, paddingTop: 10 }}>
          <Text style={styles.bold}>SYNTHESE</Text>
          <Text>Assiette de gain : {result.assietteGain.toFixed(2)} €</Text>
          <Text>Total Contributions : {result.montantPS.toFixed(2)} €</Text>
          <Text style={[styles.bold, { fontSize: 12, marginTop: 5 }]}>NET A PERCEVOIR : {result.netVendeur.toFixed(2)} €</Text>
        </View>

        <Text style={{ position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 7, textAlign: 'center', color: '#666' }}>
          Document généré par PEA Helper v3.1.0 - Format CFONB Standard.
        </Text>
      </Page>
    </Document>
  );
};

export default PEABordereauPDF;
