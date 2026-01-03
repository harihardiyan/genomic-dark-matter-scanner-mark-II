# Genomic Dark Matter Deep-Scanner
**Engine Version:** `JAX-Monolith Biophysical Core V4.0`

The **Genomic Dark Matter Deep-Scanner** is a lightweight, client-side computational tool designed to explore the biophysical properties of non-coding DNA. Rather than relying solely on sequence alignment, this tool models DNA as a physical entity to identify potential regulatory "antennas" and structural anomalies through deterministic biophysical calculations.

## 🌟 Core Advantages

*   **Multivariate Analysis**: Analyzes 11 distinct biophysical dimensions simultaneously (Thermodynamics, Stacking Energy, Electronic Topology, and Bendability).
*   **Zero-Infrastructure Screening**: Runs entirely in the browser using the JAX-Monolith engine. No high-performance computing (HPC) or backend servers are required for initial screening.
*   **Epigenetic Integration**: Supports **5-Methylcytosine (M)** to simulate how methylation shifts the physical stability and accessibility of the DNA helix.
*   **Feature Attribution**: Uses a SHAP-inspired mathematical decomposition to explain *why* a specific region is flagged as an anomaly, providing transparency to the model's predictions.

## ⚙️ How it Works (The "Engine")

The scanner treats DNA not as a string of letters, but as a dynamic molecule governed by the laws of thermodynamics:

1.  **Deterministic Nearest-Neighbor (NN) Model**: Utilizes the widely accepted **SantaLucia (1998)** parameters to calculate enthalpy ($\Delta H$) and entropy ($\Delta S$) for every dinucleotide pair.
2.  **Divalent Cation Correction**: Implements the **von Ahsen et al. (2001)** magnesium correction. This is crucial because $Mg^{2+}$ ions stabilize the DNA helix significantly more effectively than monovalent ions like $Na^{+}$.
3.  **Electronic Z-Scale Mapping**: Maps the electronic topology of sequences to predict conformational deviations (e.g., shifts toward Z-DNA or bent DNA structures).
4.  **Mahalanobis-based Anomaly Detection**: Identifies outliers by calculating the statistical distance of a window's physical signature from the global mean of the analyzed sequence.

## ⚠️ Scope and Limitations

To maintain scientific integrity, users should be aware of the following boundaries:

*   **Predictive, Not Experimental**: This tool is a **computational lead generator**. It predicts where structural shifts *should* occur based on physics, but it does not replace experimental verification.
*   **Static Modeling**: Unlike all-atom Molecular Dynamics (MD), this tool calculates "potential energy" at a fixed state. It does not simulate the real-time kinetic motion of atoms.
*   **Requires Sequence Data**: This is not a sequencing tool. It requires pre-existing genomic data (FASTA/Text) to perform its analysis.
*   **Validation Path**: Significant findings should always be validated through traditional "Gold Standard" methods such as **CD Spectroscopy**, **NMR**, or **ATAC-seq**.

## 🎯 Use Cases

*   **Lead Discovery**: Quickly scanning long non-coding regions to find "hotspots" for further MD simulation or wet-lab experiments.
*   **Mutation Impact Studies**: Visualizing how a single base change or methylation event alters the local physical "texture" of the genome.
*   **Educational Biophysics**: Demonstrating the relationship between DNA sequence, salt concentration, and thermodynamic stability.

## 🛠 Tech Stack

*   **Frontend**: React 19 / TypeScript
*   **Math/Physics**: JAX-Monolith Deterministic Engine
*   **Visualization**: Recharts

---

**Author:** Hari Hardiyan  
**Contact:** [lorozloraz@gmail.com](mailto:lorozloraz@gmail.com)  
*Note: This project is intended for research and educational purposes. Use results to guide hypotheses, not as final diagnostic evidence.*