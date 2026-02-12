import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GainResult, PEA } from '@/lib/engine/types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#000',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  sectionHeader: {
    backgroundColor: '#e5e7eb',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 20,
    alignItems: 'center',
  },
  lastRow: {
    flexDirection: 'row',
    minHeight: 20,
    alignItems: 'center',
  },
  col1: {
    width: '40%',
    paddingLeft: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    height: '100%',
    justifyContent: 'center',
  },
  col2: {
    width: '60%',
    paddingLeft: 5,
    height: '100%',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCol: {
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  colDate: { width: '25%' },
  colBase: { width: '25%' },
  colRate: { width: '15%' },
  colCsg: { width: '10%' },
  colCrds: { width: '10%' },
  colOther: { width: '15%' },
  colTotal: { width: '15%', borderRightWidth: 0 },
  
  footer: {
    marginTop: 20,
    fontSize: 7,
    fontStyle: 'italic',
  }
});

interface PDFGeneratorProps {
  result: GainResult;
  input: PEA;
}

const PEABordereauPDF = ({ result, input }: PDFGeneratorProps) => {
  const formatDate = (d: string | Date) => new Date(d).toLocaleDateString('fr-FR');
  const formatEuro = (val: number) => val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>BORDEREAU D'INFORMATIONS DE TRANSFERT DE PLAN D'EPARGNE EN ACTIONS</Text>
        </View>

        {/* SECTION 1: INTERMEDIAIRES */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>INTERMEDIAIRE DONNEUR D'ORDRE / BENEFICIAIRE</Text>
          <View style={styles.row}>
            <View style={styles.col1}><Text>Etablissement teneur du compte :</Text></View>
            <View style={styles.col2}><Text>Simulateur PEA Helper V3</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col1}><Text>Nom du titulaire :</Text></View>
            <View style={styles.col2}><Text>Client / Investisseur</Text></View>
          </View>
          <View style={styles.lastRow}>
            <View style={styles.col1}><Text>Numéro de compte PEA :</Text></View>
            <View style={styles.col2}><Text>00000000000</Text></View>
          </View>
        </View>

        {/* SECTION 2: CARACTERISTIQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CARACTERISTIQUES GENERALES DU PLAN TRANSFERE</Text>
          <View style={styles.row}>
            <View style={styles.col1}><Text>Date d'ouverture du plan :</Text></View>
            <View style={styles.col2}><Text>{formatDate(input.dateOuverture)}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col1}><Text>Montant total des versements :</Text></View>
            <View style={styles.col2}><Text>{formatEuro(input.totalVersements)}</Text></View>
          </View>
          <View style={styles.lastRow}>
            <View style={styles.col1}><Text>Valeur liquidative au jour du retrait :</Text></View>
            <View style={styles.col2}><Text>{formatEuro(input.valeurLiquidative)}</Text></View>
          </View>
        </View>

        {/* SECTION 3: CALCUL ASSIETTES */}
        <View style={{ marginBottom: 10 }}>
          <Text style={[styles.sectionHeader, { borderWidth: 1, borderColor: '#000', borderBottomWidth: 0 }]}>
            ELEMENTS DE CALCUL D'ASSIETTES DES CONTRIBUTIONS SOCIALES
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={[styles.tableCol, styles.colDate]}><Text>Période</Text></View>
              <View style={[styles.tableCol, styles.colBase]}><Text>Assiette Gain</Text></View>
              <View style={[styles.tableCol, styles.colRate]}><Text>Taux Global</Text></View>
              <View style={[styles.tableCol, styles.colTotal]}><Text>Montant dû</Text></View>
            </View>

            {result.detailsParPeriode ? (
              result.detailsParPeriode.map((p, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={[styles.tableCol, styles.colDate]}><Text>{p.periodLabel}</Text></View>
                  <View style={[styles.tableCol, styles.colBase]}><Text>{formatEuro(p.gain)}</Text></View>
                  <View style={[styles.tableCol, styles.colRate]}><Text>{p.rates.total}%</Text></View>
                  <View style={[styles.tableCol, styles.colTotal]}><Text>{formatEuro(p.taxes.total)}</Text></View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, styles.colDate]}><Text>Post-2018</Text></View>
                <View style={[styles.tableCol, styles.colBase]}><Text>{formatEuro(result.assietteGain)}</Text></View>
                <View style={[styles.tableCol, styles.colRate]}><Text>17.2%</Text></View>
                <View style={[styles.tableCol, styles.colTotal]}><Text>{formatEuro(result.montantPS)}</Text></View>
              </View>
            )}
            
            {/* Totaux */}
            <View style={[styles.tableRow, { fontWeight: 'bold', backgroundColor: '#f3f4f6' }]}>
              <View style={[styles.tableCol, styles.colDate]}><Text>TOTAL</Text></View>
              <View style={[styles.tableCol, styles.colBase]}><Text>{formatEuro(result.assietteGain)}</Text></View>
              <View style={[styles.tableCol, styles.colRate]}><Text>-</Text></View>
              <View style={[styles.tableCol, styles.colTotal]}><Text>{formatEuro(result.montantPS)}</Text></View>
            </View>
          </View>
        </View>

        {/* SECTION 4: RECAPITULATIF */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <Text style={styles.sectionHeader}>SYNTHESE DE L'OPERATION</Text>
          <View style={styles.row}>
            <View style={styles.col1}><Text>Montant brut du retrait :</Text></View>
            <View style={styles.col2}><Text>{formatEuro(result.montantRetrait)}</Text></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col1}><Text>Total des prélèvements sociaux :</Text></View>
            <View style={styles.col2}><Text>{formatEuro(result.montantPS)}</Text></View>
          </View>
          <View style={[styles.lastRow, { backgroundColor: '#f0fdf4', fontWeight: 'bold' }]}>
            <View style={styles.col1}><Text>MONTANT NET À CREDITER :</Text></View>
            <View style={styles.col2}><Text>{formatEuro(result.netVendeur)}</Text></View>
          </View>
        </View>

        <Text style={styles.footer}>
          Bordereau conforme au standard CFONB (Comité Français d'Organisation et de Normalisation Bancaires). 
          Ce document est une simulation établie sur la base des informations fournies par l'utilisateur.
          Date d'édition : {formatDate(new Date())}
        </Text>
      </Page>
    </Document>
  );
};

export default PEABordereauPDF;
