
import React from 'react';
import { AnalysisWindow } from '../types';

interface Props {
  analysisWindow: AnalysisWindow;
  onClose: () => void;
}

const DiagnosticReport: React.FC<Props> = ({ analysisWindow, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const topDrivers = analysisWindow.contributions.slice(0, 3);
  
  const getBiologicalHypothesis = (type: string, primaryDriver: string, archetype?: string) => {
    let hypothesis = "Based on JAX-Monolith biophysical sequence modeling, this region exhibits high regulatory potential. ";
    
    if (archetype === 'Triplex Potential') {
      hypothesis += "The homogeneous Purine/Pyrimidine tract indicates a potential for H-DNA (Triple-Helix) formation. These regions often serve as mechanical anchors that recruit chromatin remodeler complexes. ";
    }

    if (primaryDriver === 'BENDABILITY') {
      hypothesis += "The high Bendability score suggests a strong potential for nucleosome wrapping, indicating an active role in 3D chromatin architecture organization. ";
    }

    if (analysisWindow.sequence.includes('M')) {
      hypothesis += "The presence of 5-Methylcytosine (M) increases thermodynamic helix stability and may trigger the recruitment of Methyl-Binding Domain (MBD) proteins. ";
    }

    if (type === 'Thermal Dip' || primaryDriver === 'dG') {
      hypothesis += "A 'Melting Gate' characteristic is detected, suggesting high thermal accessibility for transcription initiation.";
    } else if (type === 'Structural Shift' || primaryDriver.includes('Z')) {
      hypothesis += "Z-Scale shifts indicate a conformational deviation from standard B-helix toward a bent or strained DNA structure.";
    }
    return hypothesis;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl min-h-[11in] p-12 shadow-2xl relative print:p-0 print:shadow-none print:m-0">
        
        <div className="absolute top-4 right-4 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-colors"
          >
            <i className="fas fa-file-pdf mr-2"></i> Print / Save PDF
          </button>
          <button 
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="text-center border-b-2 border-slate-900 pb-8 mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">Genomic Diagnostic Report</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">JAX-Monolith Biophysical Core V4.0 (Biophysical Core Engine)</p>
          <div className="mt-4 flex justify-center gap-8 text-[10px] font-mono text-slate-400">
            <span>TIMESTAMP: {new Date().toLocaleString()}</span>
            <span>ENGINE: DETERMINISTIC-NEAREST-NEIGHBOR</span>
            <span>SENSITIVITY: 3.0σ</span>
          </div>
        </div>

        <section className="mb-10">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">1. Methodology & Data Integrity</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">
            This analysis utilizes the **V4.0** deterministic engine with **SantaLucia (1998)** parameters. The **von Ahsen [Mg2+]** correction is applied for precise divalent cation thermal stability. This modeling treats DNA not as a string of characters, but as a physical entity with real stacking energy and electronic topology coordinates.
          </p>
        </section>

        <section className="mb-10">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">2. Anomaly Details (Window {analysisWindow.index})</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Coordinates:</span>
                <span className="font-mono">{analysisWindow.start} - {analysisWindow.end} bp</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Anomaly Type:</span>
                <span className="font-bold uppercase text-red-600">{analysisWindow.anomalyType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Archetype:</span>
                <span className="font-bold uppercase text-blue-700">{analysisWindow.archetype}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="font-semibold text-slate-500">Melting Point (Tm):</span>
                <span className="font-mono font-bold text-rose-600">{analysisWindow.tm.toFixed(1)}°C</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 font-mono text-xs break-all leading-relaxed">
              <span className="text-slate-400 block mb-2 font-sans font-bold uppercase tracking-widest text-[10px]">Sequence Data:</span>
              {analysisWindow.sequence}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-slate-100 px-4 py-2 mb-4">
            <h2 className="text-lg font-bold border-l-4 border-slate-900 pl-3 uppercase tracking-wide">3. Predicted 3D & Epigenetic Impact</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">
            {getBiologicalHypothesis(analysisWindow.anomalyType, topDrivers[0].feature, analysisWindow.archetype)}
          </p>
        </section>

        <section className="mb-16">
          <div className="bg-blue-50 px-4 py-4 mb-4 border border-blue-100 rounded">
            <h2 className="text-sm font-bold text-blue-800 uppercase tracking-widest flex items-center mb-2">
              <i className="fas fa-flask mr-2"></i> Scientific Guidance & Validation Path
            </h2>
            <p className="text-blue-900/80 leading-relaxed text-xs italic">
              These predictions are based on primary biophysical deterministic calculations. Please note that this model is a high-probability predictor and not a substitute for direct observation. Recommended validation steps:
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-blue-900 font-semibold">
              <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> CD Spectroscopy (Helicity confirmation)</li>
              <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> NMR (Specific atomic coordination)</li>
              <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> All-atom MD Simulation (Dynamic stability)</li>
              <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> ATAC-seq (Chromatin accessibility)</li>
            </ul>
          </div>
        </section>

        <div className="mt-auto border-t border-slate-200 pt-6 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <div>OFFICIAL DIAGNOSTIC PREDICTION #GEN-{analysisWindow.index}-{Math.floor(Math.random()*10000)}</div>
          <div>DISCLAIMER: Computational model for research use only.</div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReport;
