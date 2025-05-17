// components/onu/OnuDetailModal.tsx
import { OnuDetail } from '@/types';
import React from 'react';

interface Props {
    detail: OnuDetail;
    onClose: () => void;
}

export default function OnuDetailModal({ detail, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full relative animate-fadeIn">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition">✕</button>
                <h2 className="text-lg font-semibold mb-4">🔍 Detail ONU ID {detail.onu_id}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><strong>📛 Nama:</strong> {detail.name}</div>
                    <div><strong>📍 Deskripsi:</strong> {detail.description}</div>
                    <div><strong>💳 Serial:</strong> {detail.serial_number}</div>
                    <div><strong>🛠️ Tipe:</strong> {detail.onu_type || '-'}</div>
                    <div><strong>📶 Status:</strong> {detail.status}</div>
                    <div><strong>📥 RX Power:</strong> {detail.rx_power}</div>
                    <div><strong>📤 TX Power:</strong> {detail.tx_power}</div>
                    <div><strong>🌐 IP Address:</strong> {detail.ip_address}</div>
                    <div><strong>⏱️ Last Online:</strong> {detail.last_online}</div>
                    <div><strong>📴 Last Offline:</strong> {detail.last_offline}</div>
                    <div><strong>⏳ Uptime:</strong> {detail.uptime}</div>
                    <div><strong>📉 Downtime Duration:</strong> {detail.last_down_time_duration}</div>
                    <div><strong>❓ Offline Reason:</strong> {detail.offline_reason}</div>
                    <div><strong>📏 Jarak Optik:</strong> {detail.gpon_optical_distance}</div>
                </div>
            </div>
        </div>
    );
}
