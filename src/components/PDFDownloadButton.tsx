"use client";

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PEABordereauPDF from './PDFGenerator';
import { GainResult, PEA } from '@/lib/engine/types';

interface PDFDownloadButtonProps {
  result: GainResult;
  input: PEA;
}

export default function PDFDownloadButton({ result, input }: PDFDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<PEABordereauPDF result={result} input={input} />}
      fileName={`bordereau-pea-${new Date().toISOString().split('T')[0]}.pdf`}
      className="inline-flex items-center justify-center w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-all shadow-md mt-4"
    >
      {({ loading }) =>
        loading ? (
          'Génération du PDF...'
        ) : (
          <>
            <span className="mr-2">📥</span> Télécharger le Bordereau PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}
