"""
Implementasi Fuzzy Logic untuk decision making dan klasifikasi.
Menggunakan scikit-fuzzy untuk fuzzy inference system.
"""

import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


class FuzzyLogicSystem:
    """
    Implementasi Fuzzy Logic dengan:
    - Fuzzy membership functions
    - Fuzzy rules engine
    - Defuzzification
    - Multi-criteria decision making
    """
    
    def __init__(self):
        """Initialize Fuzzy Logic System"""
        self.inputs = {}
        self.output = None
        self.rules = []
        self.control_system = None
        self.simulation = None
        
    def add_input(self, name, universe_range, membership_functions):
        """
        Tambah input variable dengan membership functions
        
        Args:
            name: Nama variabel input
            universe_range: Tuple (min, max) untuk universe of discourse
            membership_functions: Dict {label: [type, params]}
                Contoh: {'rendah': ['trimf', [0, 0, 50]], 
                         'sedang': ['trimf', [0, 50, 100]]}
        """
        # Buat Antecedent
        universe = np.arange(universe_range[0], universe_range[1] + 1, 1)
        antecedent = ctrl.Antecedent(universe, name)
        
        # Tambah membership functions
        for label, (func_type, params) in membership_functions.items():
            if func_type == 'trimf':
                antecedent[label] = fuzz.trimf(universe, params)
            elif func_type == 'trapmf':
                antecedent[label] = fuzz.trapmf(universe, params)
            elif func_type == 'gaussmf':
                antecedent[label] = fuzz.gaussmf(universe, params[0], params[1])
        
        self.inputs[name] = antecedent
        return antecedent
        
    def add_output(self, name, universe_range, membership_functions, defuzz_method='centroid'):
        """
        Tambah output variable dengan membership functions
        
        Args:
            name: Nama variabel output
            universe_range: Tuple (min, max)
            membership_functions: Dict {label: [type, params]}
            defuzz_method: Metode defuzzifikasi ('centroid', 'bisector', 'mom', 'som', 'lom')
        """
        # Buat Consequent
        universe = np.arange(universe_range[0], universe_range[1] + 1, 1)
        consequent = ctrl.Consequent(universe, name, defuzz_method=defuzz_method)
        
        # Tambah membership functions
        for label, (func_type, params) in membership_functions.items():
            if func_type == 'trimf':
                consequent[label] = fuzz.trimf(universe, params)
            elif func_type == 'trapmf':
                consequent[label] = fuzz.trapmf(universe, params)
            elif func_type == 'gaussmf':
                consequent[label] = fuzz.gaussmf(universe, params[0], params[1])
        
        self.output = consequent
        return consequent
        
    def add_rule(self, rule_definition):
        """
        Tambah fuzzy rule
        
        Args:
            rule_definition: Dict dengan 'antecedents' dan 'consequent'
                Contoh: {
                    'antecedents': [('kriteria1', 'tinggi'), ('kriteria2', 'baik')],
                    'consequent': ('hasil', 'baik'),
                    'operator': 'AND'  # atau 'OR'
                }
        """
        antecedents = rule_definition['antecedents']
        consequent = rule_definition['consequent']
        operator = rule_definition.get('operator', 'AND')
        
        # Buat kondisi antecedent
        conditions = []
        for var_name, label in antecedents:
            if var_name in self.inputs:
                conditions.append(self.inputs[var_name][label])
        
        # Combine dengan operator
        if len(conditions) > 1:
            if operator == 'AND':
                antecedent_combined = conditions[0]
                for cond in conditions[1:]:
                    antecedent_combined = antecedent_combined & cond
            else:  # OR
                antecedent_combined = conditions[0]
                for cond in conditions[1:]:
                    antecedent_combined = antecedent_combined | cond
        else:
            antecedent_combined = conditions[0]
        
        # Buat rule
        rule = ctrl.Rule(antecedent_combined, self.output[consequent[1]])
        self.rules.append(rule)
        
        return rule
        
    def build_system(self):
        """Build control system dari rules yang sudah didefinisikan"""
        if not self.rules:
            raise ValueError("Belum ada rules. Tambahkan rules dengan add_rule().")
        
        self.control_system = ctrl.ControlSystem(self.rules)
        self.simulation = ctrl.ControlSystemSimulation(self.control_system)
        
    def compute(self, inputs):
        """
        Hitung hasil fuzzy inference
        
        Args:
            inputs: Dict {variable_name: value}
                Contoh: {'kriteria1': 75, 'kriteria2': 60}
                
        Returns:
            dict: Hasil perhitungan
        """
        if self.simulation is None:
            raise ValueError("System belum dibangun. Panggil build_system() terlebih dahulu.")
        
        # Set input values
        for var_name, value in inputs.items():
            if var_name in self.inputs:
                self.simulation.input[var_name] = value
        
        # Compute
        self.simulation.compute()
        
        # Get output
        output_name = self.output.label
        output_value = self.simulation.output[output_name]
        
        return {
            'output_value': float(output_value),
            'output_name': output_name,
            'inputs': inputs
        }


def create_decision_system(criteria_config, rules_config):
    """
    Helper function untuk membuat fuzzy decision system
    
    Args:
        criteria_config: List of dict untuk setiap kriteria
            [{
                'name': 'kualitas',
                'range': (0, 100),
                'memberships': {
                    'rendah': ['trimf', [0, 0, 50]],
                    'sedang': ['trimf', [25, 50, 75]],
                    'tinggi': ['trimf', [50, 100, 100]]
                }
            }]
        rules_config: List of rule definitions
            [{
                'antecedents': [('kualitas', 'tinggi'), ('harga', 'rendah')],
                'consequent': ('keputusan', 'baik'),
                'operator': 'AND'
            }]
            
    Returns:
        FuzzyLogicSystem: Configured system
    """
    fuzzy_sys = FuzzyLogicSystem()
    
    # Add inputs
    for criteria in criteria_config:
        fuzzy_sys.add_input(
            criteria['name'],
            criteria['range'],
            criteria['memberships']
        )
    
    # Add output (assume last item in config or default)
    output_config = criteria_config[-1] if criteria_config else None
    if output_config:
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
    for rule in rules_config:
        fuzzy_sys.add_rule(rule)
    
    # Build system
    fuzzy_sys.build_system()
    
    return fuzzy_sys


def simple_fuzzy_inference(input_values, weights=None):
    """
    Simplified fuzzy inference untuk quick calculations
    
    Args:
        input_values: List of nilai input
        weights: List of bobot (optional)
        
    Returns:
        dict: Hasil agregasi fuzzy
    """
    input_values = np.array(input_values)
    
    if weights is None:
        weights = np.ones(len(input_values)) / len(input_values)
    else:
        weights = np.array(weights)
        
    # Pastikan input_values dan weights punya panjang sama
    if len(weights) != len(input_values):
        if len(weights) > len(input_values):
            weights = weights[:len(input_values)]
        else:
            padding = np.ones(len(input_values) - len(weights)) * (1.0 / len(input_values))
            weights = np.concatenate([weights, padding])
            
    # Normalisasi weights (mencegah DivByZero)
    total_weight = np.sum(weights)
    if total_weight == 0:
        weights = np.ones(len(input_values)) / len(input_values)
    else:
        weights = weights / total_weight
    
    # Weighted average (simplified fuzzy aggregation)
    weighted_result = np.sum(input_values * weights)
    
    # Membership degrees
    memberships = {
        'rendah': float(max(0, min(1, (50 - weighted_result) / 50))),
        'sedang': float(max(0, min(1, 1 - abs(weighted_result - 50) / 25))),
        'tinggi': float(max(0, min(1, (weighted_result - 50) / 50)))
    }
    
    # Defuzzification (max membership)
    category = max(memberships.items(), key=lambda x: x[1])[0]
    
    return {
        'value': float(weighted_result),
        'category': category,
        'memberships': memberships,
        'weights_used': weights.tolist()
    }
