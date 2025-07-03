'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OnuUnactivated {
    olt_index: string;
    model: string;
    serial_number: string;
    status: string;
}

interface Props {
    onClose: () => void;
}

const OnuUnregisterModal: React.FC<Props> = ({ onClose }) => {
    const [data, setData] = useState<OnuUnactivated[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUnactivatedOnu = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/v1/onu/unactivated`);
                setData(res.data.data.detected_onu);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError('Gagal memuat data ONU unregistered.');
            } finally {
                setLoading(false);
            }
        };

        fetchUnactivatedOnu();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full relative">
                <h2 className="text-xl font-bold mb-4">Daftar ONU Belum Terdaftar</h2>

                {loading && <p className="text-gray-500 text-sm">Memuat data...</p>}

                {error && (
                    <div className="text-red-600 text-sm mb-4">
                        {error}
                    </div>
                )}

                {!loading && !error && data.length === 0 && (
                    <p className="text-gray-600 text-sm">Tidak ada ONU yang belum terdaftar.</p>
                )}

                {!loading && !error && data.length > 0 && (
                    <table className="w-full table-auto border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border px-3 py-2">No</th>
                                <th className="border px-3 py-2">OLT Index</th>
                                <th className="border px-3 py-2">Model</th>
                                <th className="border px-3 py-2">Serial Number</th>
                                <th className="border px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((onu, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{idx + 1}</td>
                                    <td className="border px-3 py-2">{onu.olt_index}</td>
                                    <td className="border px-3 py-2">{onu.model}</td>
                                    <td className="border px-3 py-2 font-mono">{onu.serial_number}</td>
                                    <td className="border px-3 py-2 capitalize">{onu.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="mt-6 text-right">
                    <button
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnuUnregisterModal;