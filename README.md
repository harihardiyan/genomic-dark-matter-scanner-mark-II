# Genomic Dark Matter Deep-Scanner
**Engine Version:** `JAX-Monolith Biophysical Core V4.0`

## 🚀 Live Demo
**URL:** [https://genomic-dark-matter-scanner-mark-ii.netlify.app/](https://genomic-dark-matter-scanner-mark-ii.netlify.app/)

---

The **Genomic Dark Matter Deep-Scanner** is a lightweight, client-side computational tool designed to explore the biophysical properties of non-coding DNA. Rather than relying solely on sequence alignment, this tool models DNA as a physical entity to identify potential regulatory "antennas" and structural anomalies through deterministic biophysical calculations.

## 🌟 Core Advantages

*   **Multivariate Analysis**: Analyzes 11 distinct biophysical dimensions simultaneously (Thermodynamics, Stacking Energy, Electronic Topology, and Bendability).
*   **Zero-Infrastructure Screening**: Runs entirely in the browser using the JAX-Monolith engine. No high-performance computing (HPC) or backend servers are required for initial screening.
*   **Epigenetic Integration**: Supports **5-Methylcytosine (M)** to simulate how methylation shifts the physical stability and accessibility of the DNA helix.
*   **Feature Attribution**: Uses a SHAP-inspired mathematical decomposition to explain *why* a specific region is flagged as an anomaly, providing transparency to the model's predictions.

## ⚙️ How it Works (The "Engine")

The scanner treats DNA not as a string of letters, but as a dynamic molecule governed by the laws of thermodynamics:

1.  **Deterministic Nearest-Neighbor (NN) Model**: Utilizes the widely accepted **SantaLucia (1998)** parameters to calculate enthalpy ($\Delta H$) and entropy ($\Delta S$) for every dinucleotide pair.
2.  **Divalent Cation Correction**: Implements the **von Ahsen et al. (2001)** magnesium correction.
3.  **Electronic Z-Scale Mapping**: Maps the electronic topology of sequences to predict conformational deviations.
4.  **Mahalanobis-based Anomaly Detection**: Identifies outliers by calculating the statistical distance of a window's physical signature from the global mean.

## 🚀 Getting Started (How to Run Local)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/harihardiyan/genomic-dark-matter-scanner-mark-II.git


    cd genomic-dark-matter-scanner
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run development server**:
    ```bash
    npm run dev
    ```

## ☁️ Deployment

### Netlify
Proyek ini sudah dikonfigurasi untuk Netlify menggunakan `netlify.toml`. Cukup hubungkan repositori ini ke Netlify, dan ia akan otomatis menjalankan `npm run build` dan mempublish folder `dist`.

## 🛠 Tech Stack

*   **Frontend**: React 19 / TypeScript
*   **Math/Physics**: JAX-Monolith Deterministic Engine
*   **Visualization**: Recharts
*   **Styling**: Tailwind CSS

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Author:** Hari Hardiyan  
**Contact:** [lorozloraz@gmail.com](mailto:lorozloraz@gmail.com)  
*Note: This project is intended for research and educational purposes.*
