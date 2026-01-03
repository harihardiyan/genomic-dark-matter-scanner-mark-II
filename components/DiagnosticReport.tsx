
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
    let hypothesis = "Berdasarkan pemodelan biofisika sekuensial JAX-Monolith, wilayah ini menunjukkan karakteristik regulasi tinggi. ";
    
    if (archetype === 'Triplex Potential') {
      hypothesis += "Struktur Purine/Pyrimidine tract yang homogen mengindikasikan potensi pembentukan H-DNA (Triple-Helix). Wilayah ini sering berfungsi sebagai jangkar mekanis yang merekrut kompleks protein remodeler kromatin. ";
    }

    if (primaryDriver === 'BENDABILITY') {
      hypothesis += "Skor Bendabilitas yang tinggi mengindikasikan potensi wrapping nucleosome yang kuat, menunjukkan peran aktif dalam organisasi arsitektur 3D kromatin. ";
    }

    if (analysisWindow.sequence.includes('M')) {
      hypothesis += "Adanya 5-Methylcytosine (M) meningkatkan stabilitas heliks secara termodinamika dan dapat memicu perekrutan protein Methyl-Binding Domain (MBD). ";
    }

    if (type === 'Thermal Dip' || primaryDriver === 'dG') {
      hypothesis += "Karakteristik 'Melting Gate' terdeteksi, menunjukkan aksesibilitas termal tinggi untuk inisiasi transkripsi.";
    } else if (type === 'Structural Shift' || primaryDriver.includes('Z')) {
      hypothesis += "Pergeseran Z-Scale mengindikasikan deviasi konformasional dari heliks-B standar ke arah struktur melengkung (bent DNA).";
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
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">JAX-Monolith Biophysical Core V4.0 (Gold Standard)</p>
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
            Analisis ini menggunakan mesin deterministik **V4.0** dengan parameter **SantaLucia (1998)**. Koreksi **von Ahsen [Mg2+]** diterapkan untuk akurasi stabilitas termal kation divalent. Pemodelan ini mengevaluasi DNA bukan sebagai string karakter, melainkan sebagai entitas fisik dengan energi *stacking* dan koordinat topologi elektronik yang nyata.
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
              Prediksi ini didasarkan pada perhitungan deterministik biofisika primer. Harap dicatat bahwa model ini merupakan prediktor probabilitas tinggi dan bukan pengganti metode observasi langsung. Langkah validasi yang disarankan:
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
