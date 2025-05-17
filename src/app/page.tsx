'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OnuData {
  board: number;
  pon: number;
  onu_id: number;
  name: string;
  onu_type: string;
  serial_number: string;
  rx_power: string;
  status: string;
}

interface OnuDetail extends OnuData {
  description: string;
  tx_power: string;
  ip_address: string;
  last_online: string;
  last_offline: string;
  uptime: string;
  last_down_time_duration: string;
  offline_reason: string;
  gpon_optical_distance: string;
}

const statusStyles: Record<string, { badgeClass: string }> = {
  Online: { badgeClass: 'bg-green-100 text-green-800' },
  Offline: { badgeClass: 'bg-red-100 text-red-800' },
  LOS: { badgeClass: 'bg-red-100 text-red-800' },
  Logging: { badgeClass: 'bg-blue-100 text-blue-800' },
  Synchronization: { badgeClass: 'bg-yellow-100 text-yellow-800' },
  'Dying Gasp': { badgeClass: 'bg-orange-100 text-orange-800' },
  'Auth Failed': { badgeClass: 'bg-pink-100 text-pink-800' },
  Unknown: { badgeClass: 'bg-gray-100 text-gray-800' },
  Empty: { badgeClass: 'bg-gray-100 text-gray-600' },
};

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

export default function OnuPage() {
  const [data, setData] = useState<OnuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(1);
  const [pon, setPon] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [detail, setDetail] = useState<OnuDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://192.168.2.254:8081/api/v1/board/${board}/pon/${pon}`);
        setData(res.data.data);
      } catch (error) {
        setData([]);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [board, pon]);

  const handleDetail = async (onu_id: number) => {
    try {
      const res = await axios.get(`http://192.168.2.254:8081/api/v1/board/${board}/pon/${pon}/onu/${onu_id}`);
      setDetail(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil detail ONU:', error);
    }
  };

  const getRxPowerColor = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num > 0 || num === 101.07) return 'text-gray-400';
    if (num <= -26) return 'text-red-600';
    if (num <= -20) return 'text-green-600';
    return 'text-yellow-500';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-md shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📡</span> Monitoring Status ONU - Board {board} / PON {pon}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Pilih Board</label>
            <select value={board} onChange={(e) => setBoard(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-gray-800">
              {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Pilih PON</label>
            <select value={pon} onChange={(e) => setPon(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-gray-800">
              {[...Array(20)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Filter Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-800">
              {allStatus.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">Cari Nama / Serial</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Contoh: ZTEG..." className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500" />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-scroll rounded border">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-200 text-xs uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">ONU ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Serial</th>
                  <th className="px-4 py-3 text-right">RX Power</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 128 }, (_, i) => {
                  const onu_id = i + 1;
                  const onu = data.find((d) => d.onu_id === onu_id);
                  const matchSearch = (f?: string) => f?.toLowerCase().includes(search.toLowerCase()) ?? false;
                  if (onu && (matchSearch(onu.name) || matchSearch(onu.serial_number) || !search)) {
                    if (statusFilter === 'All' || onu.status === statusFilter) {
                      const style = statusStyles[onu.status] || statusStyles['Unknown'];
                      return (
                        <tr key={onu_id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                          <td className="px-4 py-2">{onu.onu_id}</td>
                          <td className="px-4 py-2">{onu.name}</td>
                          <td className="px-4 py-2">{onu.onu_type || '-'}</td>
                          <td className="px-4 py-2">{onu.serial_number}</td>
                          <td className={`px-4 py-2 text-right font-medium ${getRxPowerColor(onu.rx_power)}`}>{onu.rx_power}</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.badgeClass}`}>{onu.status}</span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button onClick={() => handleDetail(onu.onu_id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs cursor-pointer transition">
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  } else if (!search && (statusFilter === 'All' || statusFilter === 'Empty')) {
                    return (
                      <tr key={onu_id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                        <td className="px-4 py-2">{onu_id}</td>
                        <td className="px-4 py-2 text-gray-400 italic">-</td>
                        <td className="px-4 py-2 text-gray-400 italic">-</td>
                        <td className="px-4 py-2 text-gray-400 italic">-</td>
                        <td className="px-4 py-2 text-right text-gray-400 italic">-</td>
                        <td className="px-4 py-2 text-center">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">Empty</span>
                        </td>
                        <td className="px-4 py-2 text-center text-gray-400 italic">-</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full relative animate-fadeIn">
            <button onClick={() => setDetail(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition" style={{ cursor: 'pointer' }}>X</button>
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
      )}
    </div>
  );
}
