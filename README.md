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
2.  **Divalent Cation Correction**: Implements the **von Ahsen et al. (2001)** magnesium correction.
3.  **Electronic Z-Scale Mapping**: Maps the electronic topology of sequences to predict conformational deviations.
4.  **Mahalanobis-based Anomaly Detection**: Identifies outliers by calculating the statistical distance of a window's physical signature from the global mean.

## 🚀 Getting Started (How to Run)

Since this is a modern React application utilizing ES Modules and Import Maps, you don't necessarily need a complex build step for local development.

### Local Development
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/genomic-dark-matter-scanner.git
    cd genomic-dark-matter-scanner
    ```
2.  **Serve the files**:
    Because it uses ES Modules, you need to run it via a local web server.
    *   Using **Node.js**: `npx serve .`
    *   Using **Python**: `python -m http.server 8000`
    *   Using **VS Code**: Use the "Live Server" extension.

## ☁️ Deployment

### Static Hosting (Recommended)
This app is a pure frontend application. You can deploy it for free on **Vercel**, **Netlify**, or **GitHub Pages**.

### Integration with Streamlit
If you are a Python developer, you can embed it using an iframe:
```python
import streamlit.components.v1 as components
components.iframe("https://your-scanner-url.vercel.app", height=800, scrolling=True)
```

## 🏷️ Recommended GitHub Topics (Tags)
When creating your repository, add these tags to make it easier for other researchers to find:
`genomics`, `bioinformatics`, `dna-biophysics`, `non-coding-dna`, `epigenetics`, `structural-biology`, `thermodynamics`, `jax-monolith`, `react`, `data-visualization`

## ⚠️ Scope and Limitations

*   **Predictive, Not Experimental**: This tool is a **computational lead generator**.
*   **Static Modeling**: It calculates "potential energy" at a fixed state, not real-time atomic motion.
*   **Validation Path**: Significant findings should be validated through **CD Spectroscopy**, **NMR**, or **ATAC-seq**.

## 🛠 Tech Stack

*   **Frontend**: React 19 / TypeScript
*   **Math/Physics**: JAX-Monolith Deterministic Engine
*   **Visualization**: Recharts

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Author:** Hari Hardiyan  
**Contact:** [lorozloraz@gmail.com](mailto:lorozloraz@gmail.com)  
*Note: This project is intended for research and educational purposes.*