'use client';
import React, { useEffect, useState } from 'react';

interface Props {
    onClose: () => void;
    onSave?: () => void; // optional callback jika perlu refresh data setelah update
}

export default function BaseUrlModal({ onClose, onSave }: Props) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        const existing = localStorage.getItem('baseURL') || '';
        setUrl(existing);
    }, []);

    const handleSave = () => {
        localStorage.setItem('baseURL', url);
        alert('✅ Base URL berhasil disimpan.');
        onSave?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">🔧 Setting Base URL API</h2>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Contoh: http://localhost:8080"
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}