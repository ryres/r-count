"""
Flask REST API Server untuk KNN dan Fuzzy Logic algorithms
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add algorithms directory to path
sys.path.append(os.path.dirname(__file__))

from algorithms.knn import calculate_knn, KNNAlgorithm
from algorithms.fuzzy_logic import simple_fuzzy_inference, FuzzyLogicSystem

app = Flask(__name__)
CORS(app)  # Enable CORS untuk Next.js

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'R-Count Python Backend',
        'version': '1.0.0'
    })


# KNN Endpoints
@app.route('/api/knn/calculate', methods=['POST'])
def knn_calculate():
    """
    Endpoint untuk perhitungan KNN
    
    Request body:
    {
        "train_data": [[...], [...]],
        "train_labels": [...],
        "test_data": [[...], [...]],
        "k": 3,
        "metric": "euclidean"
    }
    """
    try:
        data = request.get_json()
        
        # Validasi input
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['train_data', 'train_labels', 'test_data']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract parameters
        train_data = data['train_data']
        train_labels = data['train_labels']
        test_data = data['test_data']
        k = data.get('k', 3)
        metric = data.get('metric', 'euclidean')
        
        # Validasi ukuran data
        if len(train_data) != len(train_labels):
            return jsonify({'error': 'train_data dan train_labels harus sama panjang'}), 400
        
        # Kalkulasi KNN
        result = calculate_knn(
            train_data=train_data,
            train_labels=train_labels,
            test_data=test_data,
            k=k,
            metric=metric
        )
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/knn/find-optimal-k', methods=['POST'])
def knn_find_optimal_k():
    """
    Endpoint untuk mencari K optimal
    
    Request body:
    {
        "train_data": [[...], [...]],
        "train_labels": [...],
        "k_range": [1, 20],
        "metric": "euclidean"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        train_data = data.get('train_data')
        train_labels = data.get('train_labels')
        k_range = tuple(data.get('k_range', [1, 20]))
        metric = data.get('metric', 'euclidean')
        
        # Inisialisasi KNN
        knn = KNNAlgorithm(metric=metric)
        
        # Cari optimal K
        result = knn.find_optimal_k(train_data, train_labels, k_range)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# Fuzzy Logic Endpoints
@app.route('/api/fuzzy/calculate', methods=['POST'])
def fuzzy_calculate():
    """
    Endpoint untuk perhitungan Fuzzy Logic sederhana
    
    Request body:
    {
        "input_values": [75, 60, 80],
        "weights": [0.3, 0.3, 0.4]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        input_values = data.get('input_values')
        weights = data.get('weights')
        
        if not input_values:
            return jsonify({'error': 'input_values is required'}), 400
        
        # Kalkulasi fuzzy
        result = simple_fuzzy_inference(input_values, weights)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/fuzzy/inference', methods=['POST'])
def fuzzy_inference():
    """
    Endpoint untuk fuzzy inference system lengkap
    
    Request body:
    {
        "criteria": [{
            "name": "kualitas",
            "range": [0, 100],
            "memberships": {...}
        }],
        "rules": [{
            "antecedents": [("kualitas", "tinggi")],
            "consequent": ("hasil", "baik"),
            "operator": "AND"
        }],
        "inputs": {
            "kualitas": 75
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        criteria = data.get('criteria', [])
        rules = data.get('rules', [])
        inputs = data.get('inputs', {})
        
        # Buat fuzzy system
        fuzzy_sys = FuzzyLogicSystem()
        
        # Add inputs
        for criterion in criteria:
            fuzzy_sys.add_input(
                criterion['name'],
                tuple(criterion['range']),
                criterion['memberships']
            )
        
        # Add output
        fuzzy_sys.add_output(
            'hasil',
            (0, 100),
            {
                'rendah': ['trimf', [0, 0, 50]],
                'sedang': ['trimf', [25, 50, 75]],
                'tinggi': ['trimf', [50, 100, 100]]
            }
        )
        
        # Add rules
        for rule in rules:
            fuzzy_sys.add_rule(rule)
        
        # Build dan compute
        fuzzy_sys.build_system()
        result = fuzzy_sys.compute(inputs)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print("🚀 Starting R-Count Python Backend...")
    print("📍 Server running at: http://localhost:5000")
    print("📊 Available endpoints:")
    print("   - GET  /api/health")
    print("   - POST /api/knn/calculate")
    print("   - POST /api/knn/find-optimal-k")
    print("   - POST /api/fuzzy/calculate")
    print("   - POST /api/fuzzy/inference")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
