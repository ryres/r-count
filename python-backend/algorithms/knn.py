"""
Implementasi algoritma K-Nearest Neighbors (KNN) untuk klasifikasi data.
Menggunakan scikit-learn dengan kustomisasi untuk penelitian.
"""

import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score


class KNNAlgorithm:
    """
    Implementasi KNN dengan fitur:
    - Dynamic K selection
    - Multiple distance metrics
    - Confidence scoring
    - Cross-validation
    """
    
    def __init__(self, k=3, metric='euclidean', weights='uniform'):
        """
        Initialize KNN algorithm
        
        Args:
            k: Jumlah tetangga terdekat (default: 3)
            metric: Metrik jarak ('euclidean', 'manhattan', 'minkowski')
            weights: Bobot ('uniform' atau 'distance')
        """
        self.k = k
        self.metric = metric
        self.weights = weights
        self.model = None
        self.scaler = StandardScaler()
        
    def train(self, X_train, y_train):
        """
        Latih model KNN dengan data training
        
        Args:
            X_train: Feature data (numpy array atau list)
            y_train: Label data (numpy array atau list)
            
        Returns:
            dict: Training metrics
        """
        # Convert ke numpy array
        X_train = np.array(X_train)
        y_train = np.array(y_train)
        
        # Normalisasi data
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Inisialisasi dan latih model
        self.model = KNeighborsClassifier(
            n_neighbors=self.k,
            metric=self.metric,
            weights=self.weights
        )
        self.model.fit(X_train_scaled, y_train)
        
        # Hitung accuracy dengan cross-validation (dinamis cv)
        try:
            n_samples = len(X_train)
            cv_value = min(5, n_samples) if n_samples >= 2 else 0
            
            if cv_value >= 2:
                cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=cv_value)
                accuracy = float(np.mean(cv_scores))
                std_dev = float(np.std(cv_scores))
            else:
                # Fallback jika data terlalu sedikit untuk CV
                self.model.fit(X_train_scaled, y_train)
                accuracy = float(self.model.score(X_train_scaled, y_train))
                std_dev = 0.0
        except Exception:
            accuracy = 0.0
            std_dev = 0.0
        
        return {
            'accuracy': accuracy,
            'std_dev': std_dev,
            'k': self.k,
            'metric': self.metric,
            'n_samples': len(X_train)
        }
    
    def predict(self, X_test):
        """
        Prediksi label untuk data test
        
        Args:
            X_test: Feature data untuk prediksi
            
        Returns:
            dict: Hasil prediksi dengan confidence scores
        """
        if self.model is None:
            raise ValueError("Model belum dilatih. Panggil train() terlebih dahulu.")
        
        # Convert dan normalisasi
        X_test = np.array(X_test)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Prediksi
        predictions = self.model.predict(X_test_scaled)
        probabilities = self.model.predict_proba(X_test_scaled)
        
        # Dapatkan jarak ke tetangga terdekat
        distances, indices = self.model.kneighbors(X_test_scaled)
        
        # Format hasil
        results = []
        for i, pred in enumerate(predictions):
            # Confidence adalah max probability
            confidence = float(np.max(probabilities[i]))
            
            results.append({
                'prediction': int(pred) if isinstance(pred, (np.integer, int)) else str(pred),
                'confidence': confidence,
                'probabilities': {
                    str(cls): float(prob) 
                    for cls, prob in zip(self.model.classes_, probabilities[i])
                },
                'nearest_neighbors': {
                    'distances': distances[i].tolist(),
                    'indices': indices[i].tolist()
                }
            })
        
        return {
            'predictions': results,
            'total_predictions': len(results)
        }
    
    def find_optimal_k(self, X_train, y_train, k_range=(1, 20)):
        """
        Cari nilai K optimal dengan cross-validation
        
        Args:
            X_train: Training features
            y_train: Training labels
            k_range: Tuple (min_k, max_k)
            
        Returns:
            dict: K optimal dan accuracy scores
        """
        X_train = np.array(X_train)
        y_train = np.array(y_train)
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        k_scores = []
        k_values = range(k_range[0], k_range[1] + 1)
        
        for k in k_values:
            temp_model = KNeighborsClassifier(
                n_neighbors=k,
                metric=self.metric,
                weights=self.weights
            )
            scores = cross_val_score(temp_model, X_train_scaled, y_train, cv=5)
            k_scores.append({
                'k': k,
                'accuracy': float(np.mean(scores)),
                'std_dev': float(np.std(scores))
            })
        
        # Cari K dengan accuracy tertinggi
        best_k = max(k_scores, key=lambda x: x['accuracy'])
        
        return {
            'optimal_k': best_k['k'],
            'optimal_accuracy': best_k['accuracy'],
            'all_scores': k_scores
        }


def calculate_knn(train_data, train_labels, test_data, k=3, metric='euclidean'):
    """
    Helper function untuk perhitungan KNN langsung
    
    Args:
        train_data: Data training (list of lists)
        train_labels: Label training (list)
        test_data: Data test untuk prediksi (list of lists)
        k: Jumlah tetangga
        metric: Metrik jarak
        
    Returns:
        dict: Hasil prediksi dan metrics
    """
    knn = KNNAlgorithm(k=k, metric=metric)
    
    # Train model
    train_metrics = knn.train(train_data, train_labels)
    
    # Predict
    predictions = knn.predict(test_data)
    
    return {
        'training_metrics': train_metrics,
        'predictions': predictions['predictions'],
        'total_predictions': predictions['total_predictions']
    }
