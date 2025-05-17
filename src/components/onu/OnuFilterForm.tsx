// components/onu/OnuFilterForm.tsx
import React from 'react';

interface Props {
    board: number;
    pon: number;
    statusFilter: string;
    search: string;
    onBoardChange: (val: number) => void;
    onPonChange: (val: number) => void;
    onStatusChange: (val: string) => void;
    onSearchChange: (val: string) => void;
}

const allStatus = [
    'All',
    'Online',
    'Offline',
    'LOS',
    'Logging',
    'Synchronization',
    'Dying Gasp',
    'Auth Failed',
    'Unknown',
    'Empty',
];

export default function OnuFilterForm({
    board,
    pon,
    statusFilter,
    search,
    onBoardChange,
    onPonChange,
    onStatusChange,
    onSearchChange,
}: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">Pilih Board</label>
                <select value={board} onChange={(e) => onBoardChange(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-gray-800">
                    {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">Pilih PON</label>
                <select value={pon} onChange={(e) => onPonChange(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-gray-800">
                    {[...Array(20)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">Filter Status</label>
                <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-800">
                    {allStatus.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">Cari Nama / Serial</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Contoh: ZTEG..."
                    className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500"
                />
            </div>
        </div>
    );
}