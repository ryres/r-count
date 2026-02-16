# R-Count Python Backend

Backend Python untuk algoritma KNN dan Fuzzy Logic menggunakan Flask REST API.

## 📦 Instalasi

### 1. Install Python Dependencies

```bash
cd python-backend
pip install -r requirements.txt
```

### 2. Jalankan Server

```bash
python app.py
```

Server akan berjalan di `http://localhost:5000`

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### KNN Calculation
```
POST /api/knn/calculate
```

**Request Body:**
```json
{
  "train_data": [[1, 2], [2, 3], [3, 4]],
  "train_labels": [0, 1, 0],
  "test_data": [[1.5, 2.5]],
  "k": 3,
  "metric": "euclidean"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "training_metrics": {...},
    "predictions": [...]
  }
}
```

### Find Optimal K
```
POST /api/knn/find-optimal-k
```

**Request Body:**
```json
{
  "train_data": [[...], [...]],
  "train_labels": [...],
  "k_range": [1, 20],
  "metric": "euclidean"
}
```

### Fuzzy Logic Calculation (Simple)
```
POST /api/fuzzy/calculate
```

**Request Body:**
```json
{
  "input_values": [75, 60, 80],
  "weights": [0.3, 0.3, 0.4]
}
```

### Fuzzy Logic Inference (Advanced)
```
POST /api/fuzzy/inference
```

**Request Body:**
```json
{
  "criteria": [{
    "name": "kualitas",
    "range": [0, 100],
    "memberships": {
      "rendah": ["trimf", [0, 0, 50]],
      "tinggi": ["trimf", [50, 100, 100]]
    }
  }],
  "rules": [{
    "antecedents": [["kualitas", "tinggi"]],
    "consequent": ["hasil", "baik"],
    "operator": "AND"
  }],
  "inputs": {
    "kualitas": 75
  }
}
```

## 📁 Struktur

```
python-backend/
├── app.py                    # Flask server utama
├── requirements.txt          # Python dependencies
├── algorithms/
│   ├── knn.py               # KNN algorithm
│   └── fuzzy_logic.py       # Fuzzy Logic algorithm
└── README.md
```

## 🔧 Dependencies

- **Flask**: Web framework
- **Flask-CORS**: CORS support untuk Next.js
- **scikit-learn**: KNN algorithm
- **numpy**: Numerical computations
- **scikit-fuzzy**: Fuzzy Logic inference

## 💡 Contoh Penggunaan

```python
# Test KNN
import requests

response = requests.post('http://localhost:5000/api/knn/calculate', json={
    'train_data': [[1, 2], [2, 3], [3, 4], [4, 5]],
    'train_labels': [0, 1, 0, 1],
    'test_data': [[2.5, 3.5]],
    'k': 3
})

print(response.json())
```

## 📝 Notes

- Server berjalan di port 5000 secara default
- CORS enabled untuk komunikasi dengan Next.js di port 3000
- Error handling built-in untuk semua endpoints
