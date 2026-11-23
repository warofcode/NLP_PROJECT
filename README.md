# Domain-Specific Document Classifier (Legal Domain)

A full-stack NLP web application built for university evaluation and legal-tech industry workflows. The system features a **dual-model architecture** comparing a Classical ML Baseline (**TF-IDF + Calibrated Linear Classifier**) against a Domain-Adapted Transformer (**Legal-BERT**), providing automated contract clause classification, legal risk scoring, and bulk due diligence document routing.

---

## 1. System Architecture & Dual-Model Design

```
                     ┌──────────────────────────────────────────────┐
                     │              Legal Document                  │
                     │         (PDF, DOCX, or Raw Text)             │
                     └──────────────────────┬───────────────────────┘
                                            │
                                  [Document Extractor]
                                  (PyMuPDF / docx / regex)
                                            │
                                 [Clause Segmenter]
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
         ┌─────────────────────┐                         ┌─────────────────────┐
         │       MODEL A       │                         │       MODEL B       │
         │ TF-IDF + Calibrated │                         │     Legal-BERT      │
         │  Linear Classifier  │                         │ (nlpaueb/legal-bert)│
         └──────────┬──────────┘                         └──────────┬──────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            ▼
                           ┌─────────────────────────────────┐
                           │      Legal Risk Engine          │
                           │  - Low / Medium / High Badges   │
                           │  - Liability Triggers           │
                           │  - Top-3 Softmax Probabilities  │
                           └────────────────┬────────────────┘
                                            ▼
                           ┌─────────────────────────────────┐
                           │         React Frontend          │
                           │  - Interactive Split-View       │
                           │  - Bulk Due Diligence Sorter    │
                           │  - Academic Benchmark Charts    │
                           └─────────────────────────────────┘
```

### Model Specifications
- **Model A (Classical ML Baseline):** `TfidfVectorizer(ngram_range=(1, 2), max_features=4000)` + `LogisticRegression(class_weight="balanced")` calibrated for confidence probability estimation. Serialized via `joblib`. Delivers ultra-low latency (~0.8 ms per clause).
- **Model B (Domain Transformer):** `nlpaueb/legal-bert-base-uncased` fine-tuned / zero-shot wrapper with adaptive CUDA/CPU device mapping and an offline-resilient domain-semantic fallback engine for 100% crash resistance during academic viva demos.
- **Risk Assessment Engine:** Maps categories to base risk levels and dynamically elevates clauses containing aggressive legal stipulations (e.g. `unlimited liability`, `sole discretion`, `liquidated damages`, `perpetual and irrevocable`).

---

## 2. Taxonomies & Class Definitions

### A. 10 Contract Clause Categories
1. **Confidentiality:** Non-disclosure of proprietary information and trade secrets (*Medium Risk*).
2. **Termination:** Grounds, notice periods, and immediate dissolution rights (*High Risk*).
3. **Indemnification:** Hold-harmless obligations defending against third-party claims (*High Risk*).
4. **Limitation of Liability:** Damage caps and exclusion of consequential losses (*High Risk*).
5. **Governing Law:** Jurisdiction, chosen state/national laws, and arbitration venues (*Low Risk*).
6. **Payment Terms:** Consideration, milestone invoicing schedules, and late fees (*Medium Risk*).
7. **Auto-Renewal:** Automatic subscription renewal mechanisms and opt-out notice windows (*High Risk*).
8. **Intellectual Property:** Ownership, assignment, patent/copyright licensing, work made for hire (*High Risk*).
9. **Warranties & Disclaimers:** Quality representations and "AS-IS" liability disclaimers (*Medium Risk*).
10. **Force Majeure:** Relief of performance obligations during unforeseen catastrophes (*Low Risk*).

### B. 5 Document Types (Due Diligence Bulk Sorter)
1. **Non-Disclosure Agreement (NDA)**
2. **Employment Agreement**
3. **Commercial Lease Agreement**
4. **Service / Vendor Agreement**
5. **Court Judgment / Settlement**

---

## 3. Project Structure

```
.
├── backend/
│   ├── main.py                     # FastAPI REST app & endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── nlp/
│   │   ├── categories.py           # Legal taxonomies, risk rules, trigger lists
│   │   ├── extractor.py            # PDF (PyMuPDF), DOCX, TXT parser & clause splitter
│   │   ├── preprocessor.py         # Text cleaning and token normalization
│   │   ├── dataset.py              # Curated legal training and evaluation corpus
│   │   ├── baseline_model.py       # Model A (TF-IDF + Calibrated Linear Classifier)
│   │   └── legal_bert.py           # Model B (Domain Legal-BERT with resilient fallback)
│   ├── scripts/
│   │   ├── train.py                # Trains Model A and serializes to joblib
│   │   └── evaluate.py             # Generates comparative metrics & metrics.json
│   ├── data/
│   │   ├── baseline_model.joblib   # Trained Model A artifact
│   │   └── metrics.json            # Pre-computed evaluation benchmarks
│   └── tests/
│       └── test_api.py             # Pytest suite (10 unit & integration tests)
├── frontend/
│   ├── src/
│   │   ├── api.ts                  # REST API client
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── components/
│   │   │   ├── Layout/             # Sidebar, Header, Theme toggles
│   │   │   ├── ClauseAnalyzer/     # Split-view, Upload zone, Clause inspector
│   │   │   ├── BulkSorter/         # Multi-file dropzone, sortable table, CSV export
│   │   │   └── Benchmarks/         # Comparison cards, Recharts F1 chart, Confusion matrix
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── sample_docs/
│   ├── sample_nda.txt              # Standard Non-Disclosure Agreement
│   ├── sample_freelance_agreement.txt # Services contract with liability & indemnification
│   └── sample_commercial_lease.txt # Commercial real estate lease agreement
└── README.md
```

---

## 4. Setup & Installation

### Prerequisites
- **Python 3.10+** (Tested on Python 3.12)
- **Node.js 18+** and **npm**

### Step 1: Backend Setup
```bash
# Navigate to project root
cd "d:\nlp project 2"

# Install backend dependencies
python -m pip install -r backend/requirements.txt
```

### Step 2: Train Model A & Generate Benchmark Metrics
```bash
# Train Model A (TF-IDF + Linear Classifier)
python backend/scripts/train.py

# Run standalone evaluation benchmark comparing Model A vs Model B
python backend/scripts/evaluate.py
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
```

---

## 5. Running the Application

### Option A: Run Backend Server
In terminal 1:
```bash
# Start FastAPI backend server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`

### Option B: Run Frontend Development Server
In terminal 2:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 6. Automated Verification & Testing

### Run Backend Unit & Integration Tests (10/10 Tests)
```bash
python -m pytest backend/tests/test_api.py -v
```
**Verification Scope:**
- Text preprocessor and quote normalizer
- Heuristic legal clause segmenter and header extraction
- Risk scoring rules and dynamic trigger elevation
- Model A baseline prediction pipeline
- Model B Legal-BERT inference and fallback mode
- All REST API endpoints: `/api/health`, `/api/samples`, `/api/analyze/clause`, `/api/analyze/document`, `/api/metrics`

### Run Frontend TypeScript Compilation & Production Build
```bash
cd frontend
npm run build
```
Verifies complete type safety with zero TypeScript or bundler errors.

---

## 7. Key Features for Academic Evaluation (Viva Demos)

1. **One-Click Sample Contract Loading:**
   Buttons for *Sample NDA*, *Freelance Agreement*, and *Commercial Lease* allow instant demo evaluation without manual typing or searching for files.
2. **Interactive Split-View Reader:**
   Clicking any clause highlights its exact text, displays its predicted classification, shows an alert explaining legal liability traps, and renders a Recharts bar chart of top-3 softmax probabilities.
3. **Due Diligence Bulk Sorter:**
   Drop 5–50 files simultaneously to categorize each contract by agreement type, flag files with high-risk clauses, and export the audited portfolio to a formatted CSV spreadsheet.
4. **Model Comparison Benchmarks Tab:**
   Visualizes Accuracy, Macro F1, Average Inference Latency, and interactive Confusion Matrices comparing the classical baseline vs. domain transformer for academic presentation.
