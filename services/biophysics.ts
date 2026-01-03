
import { 
  BASE_TO_ID, 
  HBOND_PER_BASE, 
  Z_VEC, 
  STACK_E_KCAL, 
  BENDABILITY_INDEX,
  DELTA_H, 
  DELTA_S_CAL, 
  T_KELVIN, 
  K_SALT, 
  EPS 
} from '../constants';
import { 
  AnalysisWindow, 
  BiophysicalFeatures, 
  AnalysisStats, 
  CorrelationPoint, 
  ComparisonResult, 
  AnalysisWindowDelta, 
  AnomalyType, 
  BiologicalArchetype,
  BiologicalSummary 
} from '../types';

/**
 * Deteksi Inverted Repeats (Cruciform DNA).
 * Jangkar mekanis kritis bagi pengorganisasian domain topologi.
 */
function hasCruciformMotif(seq: string): boolean {
  const comp: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C', 'M': 'G' };
  const minRepeat = 5;
  const minSpacer = 3;
  const maxSpacer = 12;

  for (let i = 0; i <= seq.length - (2 * minRepeat + minSpacer); i++) {
    const left = seq.substring(i, i + minRepeat);
    for (let s = minSpacer; s <= maxSpacer; s++) {
      const j = i + minRepeat + s;
      if (j + minRepeat > seq.length) break;
      const right = seq.substring(j, j + minRepeat);
      const revCompRight = right.split('').reverse().map(b => comp[b] || b).join('');
      if (left === revCompRight) return true;
    }
  }
  return false;
}

function hasCTCFAnchor(seq: string): boolean {
  return /CC[GC].[GC]G[GC]GG/.test(seq);
}

function hasRigidPolyTract(seq: string): boolean {
  return /AAAAA/.test(seq) || /TTTTT/.test(seq);
}

/**
 * Deteksi Purine/Pyrimidine tracts panjang (Potential H-DNA/Triplex).
 * Kritis untuk regulasi transkripsi non-kanonikal.
 */
function hasTriplexPotential(seq: string): boolean {
  const isPurineOnly = /^[AGM]+$/.test(seq);
  const isPyrimOnly = /^[CTM]+$/.test(seq);
  return (isPurineOnly || isPyrimOnly) && seq.length >= 12;
}

function calculateWindowFeatures(sub: string, salt: number, saltMg: number): BiophysicalFeatures {
  const len = sub.length;
  let gcCount = 0;
  let hbSum = 0;
  let zxSum = 0;
  let zySum = 0;
  let zzSum = 0;
  let stackSum = 0;
  let bendSum = 0;
  let dHSum = 0;
  let dSSum = 0;
  let altCount = 0;

  const isPurine = (b: string) => b === 'A' || b === 'G';

  for (let i = 0; i < len; i++) {
    const b = sub[i];
    const id = BASE_TO_ID[b] ?? 0;
    if (b === 'C' || b === 'G' || b === 'M') gcCount++;
    hbSum += HBOND_PER_BASE[id];
    zxSum += Z_VEC[id][0];
    zySum += Z_VEC[id][1];
    zzSum += Z_VEC[id][2];

    if (i < len - 1) {
      const nextB = sub[i + 1];
      const nextId = BASE_TO_ID[nextB] ?? 0;
      stackSum += STACK_E_KCAL[id][nextId];
      bendSum += BENDABILITY_INDEX[id][nextId];
      dHSum += DELTA_H[id][nextId];
      dSSum += DELTA_S_CAL[id][nextId];

      if (isPurine(b) !== isPurine(nextB)) altCount++;
    }
  }

  const nPairs = Math.max(len - 1, 1);
  const dG_raw = (dHSum * 1000 - T_KELVIN * dSSum) / 1000;
  const effectiveSalt = salt + 120 * Math.sqrt(Math.max(saltMg, 0));
  const saltCorr = (nPairs * 0.114 * K_SALT * Math.log(Math.max(effectiveSalt, 1e-5)));
  const dG_corr = dG_raw - saltCorr;

  return {
    gc: gcCount / len,
    hb_per_base: hbSum / len,
    stack_per_base: stackSum / nPairs,
    dG_per_base: dG_corr / nPairs,
    zx: zxSum / len,
    zy: zySum / len,
    zz: zzSum / len,
    bendability: bendSum / nPairs,
    purine_pyrimidine_alt: altCount / nPairs
  };
}

function calculateStats(featureSet: BiophysicalFeatures[]): AnalysisStats {
  if (featureSet.length === 0) throw new Error("Stats error: Empty set");
  const keys = Object.keys(featureSet[0]) as (keyof BiophysicalFeatures)[];
  const mean: any = {};
  const std: any = {};

  keys.forEach(key => {
    const vals = featureSet.map(f => f[key]);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    mean[key] = avg;
    const variance = vals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / vals.length;
    std[key] = Math.sqrt(variance);
  });

  return { mean, std };
}

function calculateCrossCorrelation(windows: AnalysisWindow[]): CorrelationPoint[] {
  const points: CorrelationPoint[] = [];
  const movingWindow = 5;
  
  const pearson = (a: number[], b: number[]): number => {
    const n = a.length;
    if (n === 0) return 0;
    const avgA = a.reduce((s, v) => s + v, 0) / n;
    const avgB = b.reduce((s, v) => s + v, 0) / n;
    let num = 0, denA = 0, denB = 0;
    for (let i = 0; i < n; i++) {
      const da = a[i] - avgA;
      const db = b[i] - avgB;
      num += da * db;
      denA += da * da;
      denB += db * db;
    }
    const den = Math.sqrt(denA * denB);
    return den < EPS ? 0 : num / den;
  };

  for (let i = 0; i <= windows.length - movingWindow; i++) {
    const slice = windows.slice(i, i + movingWindow);
    const hbs = slice.map(w => w.features.hb_per_base);
    const stacks = slice.map(w => w.features.stack_per_base);
    points.push({ index: windows[i].index, correlation: pearson(hbs, stacks) });
  }
  return points;
}

export function analyzeSequence(sequence: string, threshold: number = 3.0, W: number = 15, S: number = 5, salt: number = 0.1, saltMg: number = 0.0015) {
  const seq = sequence.toUpperCase().replace(/[^ACGTM]/g, 'N');
  const windows: AnalysisWindow[] = [];
  
  if (seq.length < W) throw new Error(`Sequence too short for window size ${W}.`);

  for (let i = 0; i <= seq.length - W; i += S) {
    const sub = seq.substring(i, i + W);
    const windowFeatures = calculateWindowFeatures(sub, salt, saltMg);
    const effectiveSalt = salt + 120 * Math.sqrt(Math.max(saltMg, 0));
    const tm = 64.9 + 41 * (windowFeatures.gc - 0.5) + (16.6 * Math.log10(Math.max(effectiveSalt, 1e-5)));

    windows.push({
      index: Math.floor(i / S),
      start: i,
      end: i + W,
      sequence: sub,
      features: windowFeatures,
      isAnomalous: false,
      zScores: {},
      anomalyType: 'None',
      archetype: 'Stable Helix',
      combinedScore: 0,
      contributions: [],
      tm: tm
    });
  }

  const stats = calculateStats(windows.map(w => w.features));
  
  windows.forEach(w => {
    const features = w.features as any;
    const means = stats.mean as any;
    const stds = stats.std as any;
    let distSq = 0;
    const rawContributions: {feature: string, zSq: number}[] = [];
    
    for (const key in features) {
      const val = features[key];
      const mean = means[key];
      const std = stds[key] > EPS ? stds[key] : EPS;
      const z = (val - mean) / std;
      w.zScores[key] = z;
      const zSq = z * z;
      distSq += zSq;
      rawContributions.push({ feature: key, zSq });
    }
    
    w.combinedScore = Math.sqrt(distSq);
    w.contributions = rawContributions.map(c => ({
      feature: c.feature,
      score: (c.zSq / (distSq || EPS)) * w.combinedScore,
      percentage: (c.zSq / (distSq || EPS)) * 100
    })).sort((a, b) => b.score - a.score);

    if (Math.abs(w.zScores.dG_per_base) > threshold) {
      w.isAnomalous = true;
      w.anomalyType = w.zScores.dG_per_base < 0 ? 'Thermal Dip' : 'Structural Shift';
    }
    
    if (Math.abs(w.zScores.stack_per_base) > threshold && w.anomalyType === 'None') {
      w.isAnomalous = true;
      w.anomalyType = 'Stacking Anchor';
    }

    if (w.combinedScore > threshold * 2 && w.anomalyType === 'None') {
      w.isAnomalous = true;
      w.anomalyType = 'Multivariate Deviation';
    }

    w.archetype = classifyArchetype(w, saltMg);
  });

  const correlationMap = calculateCrossCorrelation(windows);
  
  const summary: BiologicalSummary = {
    promoterPotential: windows.filter(w => w.archetype === 'Putative Promoter').length,
    structuralAnchors: windows.filter(w => ['Mechanical Anchor', 'G-Quadruplex', 'Triplex Potential'].includes(w.archetype)).length,
    zDnaSites: windows.filter(w => w.archetype === 'Z-DNA Candidate').length,
    avgTm: windows.reduce((acc, w) => acc + w.tm, 0) / windows.length
  };

  return { windows, stats, correlationMap, thresholdUsed: threshold, multivariateScores: windows.map(w => w.combinedScore), summary };
}

function classifyArchetype(w: AnalysisWindow, saltMg: number): BiologicalArchetype {
  const z = w.zScores;
  const feat = w.features;
  const seq = w.sequence;
  
  // 1. Z-DNA DETECTION (RY Alternation + Physical Strain)
  const zDnaLikelihood = feat.purine_pyrimidine_alt * (feat.gc > 0.6 ? 1.2 : 1.0) * (saltMg > 0.001 ? 1.5 : 1.0);
  if (zDnaLikelihood > 0.88) return 'Z-DNA Candidate';
  
  // 2. TRIPLEX POTENTIAL (Specific AG/CT Tracts)
  if (hasTriplexPotential(seq)) return 'Triplex Potential'; 

  // 3. STRUCTURAL ANCHORS
  if (hasCTCFAnchor(seq) || hasCruciformMotif(seq) || hasRigidPolyTract(seq) || (z.stack_per_base < -2.1 && feat.bendability < 0.08)) {
    return 'Mechanical Anchor';
  }

  // 4. PROMOTER DETECTION (TATA, Inr, -35)
  const hasTATA = /TATA[AT]A[AT]/.test(seq) || /TATAAT/.test(seq);
  const hasMinus35 = /TTGACA/.test(seq);
  const hasInr = /[CT][CT]A[AT][CT][CT]/.test(seq); 

  if (hasTATA || hasMinus35 || hasInr || (z.dG_per_base < -2.3 && feat.bendability > 0.38)) {
    return 'Putative Promoter';
  }
  
  // 5. G-QUADRUPLEX
  if (/GGGG/.test(seq) && feat.gc > 0.75) return 'G-Quadruplex';
  
  // 6. FLEXIBLE LINKERS
  if (feat.bendability > 0.48 && Math.abs(z.dG_per_base) < 1.0) return 'Flexible Linker';
  
  return w.isAnomalous ? 'Unknown Anomaly' : 'Stable Helix';
}

export function compareSequences(resA: {windows: AnalysisWindow[]}, resB: {windows: AnalysisWindow[]}): ComparisonResult {
  const len = Math.min(resA.windows.length, resB.windows.length);
  const deltas: AnalysisWindowDelta[] = [];
  const sumDiff: any = { gc: 0, hb_per_base: 0, stack_per_base: 0, dG_per_base: 0, zx: 0, zy: 0, zz: 0, bendability: 0, purine_pyrimidine_alt: 0 };
  
  for (let i = 0; i < len; i++) {
    const wA = resA.windows[i];
    const wB = resB.windows[i];
    const diff: BiophysicalFeatures = {
      gc: wB.features.gc - wA.features.gc,
      hb_per_base: wB.features.hb_per_base - wA.features.hb_per_base,
      stack_per_base: wB.features.stack_per_base - wA.features.stack_per_base,
      dG_per_base: wB.features.dG_per_base - wA.features.dG_per_base,
      zx: wB.features.zx - wA.features.zx,
      zy: wB.features.zy - wA.features.zy,
      zz: wB.features.zz - wA.features.zz,
      bendability: wB.features.bendability - wA.features.bendability,
      purine_pyrimidine_alt: wB.features.purine_pyrimidine_alt - wA.features.purine_pyrimidine_alt
    };
    deltas.push({ index: i, start: wA.start, end: wA.end, diff });
    for (const key in diff) { sumDiff[key] += (diff as any)[key]; }
  }

  const avgDelta: BiophysicalFeatures = {
    gc: sumDiff.gc / len, hb_per_base: sumDiff.hb_per_base / len, stack_per_base: sumDiff.stack_per_base / len, dG_per_base: sumDiff.dG_per_base / len, zx: sumDiff.zx / len, zy: sumDiff.zy / len, zz: sumDiff.zz / len, bendability: sumDiff.bendability / len, purine_pyrimidine_alt: sumDiff.purine_pyrimidine_alt / len
  };

  return { deltas, avgDelta };
}
