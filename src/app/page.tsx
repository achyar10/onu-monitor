// app/OnuPage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OnuData, OnuDetail } from '../types';
import OnuFilterForm from '../components/onu/OnuFilterForm';
import OnuTable from '../components/onu/OnuTable';
import OnuDetailModal from '../components/onu/OnuDetailModal';

export default function OnuPage() {
  const [data, setData] = useState<OnuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(1);
  const [pon, setPon] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [detail, setDetail] = useState<OnuDetail | null>(null);

  const fetchData = async (selectedBoard: number, selectedPon: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/v1/board/${selectedBoard}/pon/${selectedPon}`);
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(board, pon);
  }, [board, pon]);

  const handleDetail = async (onu_id: number) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/v1/board/${board}/pon/${pon}/onu/${onu_id}`);
      setDetail(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil detail ONU:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-md shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📡</span> Monitoring Status ONU - Board {board} / PON {pon}
        </h1>

        <OnuFilterForm
          board={board}
          pon={pon}
          statusFilter={statusFilter}
          search={search}
          onBoardChange={setBoard}
          onPonChange={setPon}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Memuat data...</div>
        ) : (
          <OnuTable data={data} search={search} statusFilter={statusFilter} onDetail={handleDetail} />
        )}
      </div>

      {detail && <OnuDetailModal detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
