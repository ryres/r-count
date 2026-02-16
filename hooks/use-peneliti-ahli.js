"use client";

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'peneliti-ahli-v1';

// URL API - Gunakan env variable untuk production
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Custom hook untuk mengelola state dan logika Peneliti Ahli
 */
export function usePenelitiAhli() {
    const [dataState, setDataState] = useState({
        users: [
            { id: 'admin-1', name: 'Ryan Admin', email: 'ryan@nibs.sch.id', password: '12345', role: 'administrator' },
            { id: 'user-1', name: 'Operator', email: 'op@nibs.sch.id', password: '12345', role: 'user' }
        ],
        kriteria: [
            { id: 'k1', name: 'Fitur 1', weight: 0.4 },
            { id: 'k2', name: 'Fitur 2', weight: 0.3 },
            { id: 'k3', name: 'Fitur 3', weight: 0.3 }
        ],
        bobot: [
            { id: 'b1', label: 'Rendah', value: 20 },
            { id: 'b2', label: 'Sedang', value: 50 },
            { id: 'b3', label: 'Tinggi', value: 80 }
        ],
        data: [
            { id: 'd1', features: [10, 20, 30], label: 'A' },
            { id: 'd2', features: [15, 25, 35], label: 'B' },
            { id: 'd3', features: [50, 60, 70], label: 'C' },
            { id: 'd4', features: [12, 22, 32], label: 'A' },
            { id: 'd5', features: [55, 65, 75], label: 'C' }
        ],
        history: [
            {
                id: 'h1',
                type: 'KNN',
                timestamp: new Date().toISOString(),
                prediction: 'A',
                confidence: 0.95,
                input: [11, 21, 31]
            },
            {
                id: 'h2',
                type: 'FUZZY',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                data: { value: 75.5, category: 'Tinggi' },
                input: [40, 50, 60]
            }
        ],
        results: { knn: null, fuzzy: null }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Load data dari LocalStorage saat mounted
    useEffect(() => {
        setIsMounted(true);
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setDataState(prev => ({
                    ...prev,
                    ...parsed
                }));
            } catch (e) {
                console.error("Gagal parse data dari LocalStorage:", e);
            }
        }
    }, []);

    // Simpan ke LocalStorage saat dataState berubah
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                users: dataState.users,
                kriteria: dataState.kriteria,
                bobot: dataState.bobot,
                data: dataState.data,
                history: dataState.history
            }));
        }
    }, [dataState, isMounted]);

    // --- CRUD Operations Helper ---
    const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

    const addItem = (key, newItem) => {
        const itemWithId = { ...newItem, id: newItem.id || generateId() };
        setDataState(prev => ({
            ...prev,
            [key]: [...prev[key], itemWithId]
        }));
        return itemWithId;
    };

    const updateItem = (key, id, updatedFields) => {
        setDataState(prev => ({
            ...prev,
            [key]: prev[key].map(item => item.id === id ? { ...item, ...updatedFields } : item)
        }));
    };

    const deleteItem = (key, id) => {
        setDataState(prev => ({
            ...prev,
            [key]: prev[key].filter(item => item.id !== id)
        }));
    };

    // --- API Handlers (Network Storage) ---
    const fetchPythonApi = async (endpoint, payload) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setIsLoading(false);
            return result;
        } catch (e) {
            setIsLoading(false);
            const msg = "Gagal terhubung ke Python Backend (Port 5000)";
            setError(msg);
            console.error(`Gagal hit Python API (${endpoint}):`, e);
            throw new Error(msg);
        }
    };

    // --- Public Methods (Sesuai Skill Peneliti-Ahli) ---

    // User Methods
    const addUser = (data) => addItem('users', data);
    const updateUser = (id, data) => updateItem('users', id, data);
    const deleteUser = (id) => deleteItem('users', id);
    const getUser = (id) => dataState.users.find(u => u.id === id);
    const getAllUser = () => dataState.users;

    // Kriteria Methods
    const addKriteria = (data) => addItem('kriteria', data);
    const updateKriteria = (id, data) => updateItem('kriteria', id, data);
    const deleteKriteria = (id) => deleteItem('kriteria', id);
    const getKriteria = (id) => dataState.kriteria.find(k => k.id === id);
    const getAllKriteria = () => dataState.kriteria;

    // Bobot Methods
    const addBobot = (data) => addItem('bobot', data);
    const updateBobot = (id, data) => updateItem('bobot', id, data);
    const deleteBobot = (id) => deleteItem('bobot', id);
    const getBobot = (id) => dataState.bobot.find(b => b.id === id);
    const getAllBobot = () => dataState.bobot;

    // Data Methods
    const addData = (data) => addItem('data', data);
    const updateData = (id, data) => updateItem('data', id, data);
    const deleteData = (id) => deleteItem('data', id);
    const getData = (id) => dataState.data.find(d => d.id === id);
    const getAllData = () => dataState.data;

    // Calculation Logic (KNN & Fuzzy)
    const calculateKNN = async (testFeatures) => {
        if (dataState.data.length === 0) {
            setError("Dataset training kosong.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                train_data: dataState.data.map(d => d.features),
                train_labels: dataState.data.map(d => d.label),
                test_data: [testFeatures],
                k: 3,
                metric: 'euclidean'
            };

            const result = await fetchPythonApi('/api/knn/calculate', payload);

            // Perbaikan mapping: result.data adalah output dari calculate_knn
            // yang berisi { predictions: [{ prediction, confidence, ... }] }
            const firstResult = result.data.predictions[0];

            const prediction = {
                id: generateId(),
                type: 'KNN',
                timestamp: new Date().toISOString(),
                prediction: firstResult.prediction,
                confidence: firstResult.confidence || 0,
                input: testFeatures
            };

            setDataState(prev => ({
                ...prev,
                history: [prediction, ...prev.history].slice(0, 50),
                results: { ...prev.results, knn: prediction }
            }));
            return prediction;
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateFuzzy = async (inputValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Perbaikan key: backend ekspektasi 'input_values'
            const result = await fetchPythonApi('/api/fuzzy/calculate', {
                input_values: inputValues,
                weights: dataState.kriteria.map(k => k.weight)
            });

            const evaluation = {
                id: generateId(),
                type: 'FUZZY',
                timestamp: new Date().toISOString(),
                data: result.data || { value: 0, category: 'N/A' },
                input: inputValues
            };

            setDataState(prev => ({
                ...prev,
                history: [evaluation, ...prev.history].slice(0, 50),
                results: { ...prev.results, fuzzy: evaluation }
            }));
            return evaluation;
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Printout Function (Format & Print)
    const printout = (data, title, description, footer, date, signature) => {
        const printWindow = window.open('', '_blank');
        const content = `
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: sans-serif; padding: 20px; }
                h1 { text-align: center; }
                .meta { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 40px; }
                .sig-box { float: right; margin-top: 20px; text-align: center; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <div class="meta">
                <p>${description}</p>
                <p>Tanggal: ${date || new Date().toLocaleDateString('id-ID')}</p>
              </div>
              <table>
                <thead>
                  <tr>${data.length > 0 ? Object.keys(data[0]).map(k => `<th>${k}</th>`).join('') : ''}</tr>
                </thead>
                <tbody>
                  ${data.map(row => `
                    <tr>${Object.values(row).map(v => `<td>${typeof v === 'object' ? JSON.stringify(v) : v}</td>`).join('')}</tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="footer">
                <p>${footer}</p>
                <div class="sig-box">
                  <p>Tertanda,</p>
                  <br/><br/><br/>
                  <p><strong>${signature || 'Petugas'}</strong></p>
                </div>
              </div>
              <script>window.print();</script>
            </body>
          </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setDataState({
            users: [],
            kriteria: [],
            bobot: [],
            data: [],
            history: [],
            results: { knn: null, fuzzy: null }
        });
    };

    return {
        // State
        ...dataState,
        isLoading,
        error,
        isMounted,

        // CRUD Methods
        addUser, updateUser, deleteUser, getUser, getAllUser,
        addKriteria, updateKriteria, deleteKriteria, getKriteria, getAllKriteria,
        addBobot, updateBobot, deleteBobot, getBobot, getAllBobot,
        addData, updateData, deleteData, getData, getAllData,

        // Calculations
        calculateKNN,
        calculateFuzzy,

        // Utilities
        printout,
        logout
    };
}
