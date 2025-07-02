'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OnuData, OnuDataRegister, OnuDetail } from '../types';
import OnuFilterForm from '../components/onu/OnuFilterForm';
import OnuTable from '../components/onu/OnuTable';
import OnuDetailModal from '../components/onu/OnuDetailModal';
import OnuRegisterModal from '@/components/onu/OnuRegisterModal';
import { useRouter } from 'next/navigation';

export default function OnuPage() {
  const [data, setData] = useState<OnuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(1);
  const [pon, setPon] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [detail, setDetail] = useState<OnuDetail | null>(null);
  const [registerData, setRegisterData] = useState<OnuDataRegister | null>(null);
  const [isRebooting, setIsRebooting] = useState(false);

  const router = useRouter();

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
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/login');
    }
    fetchData(board, pon);
  }, [board, pon, router]);

  const handleDetail = async (onu_id: number) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/v1/board/${board}/pon/${pon}/onu/${onu_id}`);
      setDetail(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil detail ONU:', error);
    }
  };

  const handleRegister = (onu: OnuDataRegister) => {
    setRegisterData(onu);
  };

  const handleRefresh = () => {
    fetchData(board, pon);
  };

  const handleReboot = (onu_id: number) => {
    if (isRebooting) return; // mencegah double click
    if (!window.confirm(`Yakin reboot ONU ID ${onu_id}?`)) return;

    setIsRebooting(true);

    fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/v1/onu/reboot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        olt_index: `gpon-olt_1/${board}/${pon}`,
        onu: onu_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          alert('✅ Reboot berhasil');
        } else {
          alert(`⚠️ Gagal reboot: ${data.status}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('❌ Terjadi kesalahan saat reboot.');
      })
      .finally(() => {
        setIsRebooting(false);
      });
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-md shadow-md p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span>📡</span> Monitoring Status ONU - Board {board} / PON {pon}
          </h1>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="bg-green-600 text-white text-sm cursor-pointer px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('loggedIn');
                router.push('/login');
              }}
              className="text-sm bg-red-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
            Logout
            </button>
          </div>
        </div>

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
            <OnuTable data={data} search={search} statusFilter={statusFilter} onDetail={handleDetail} onRegister={handleRegister} onReboot={handleReboot} />
        )}
      </div>

      {detail && <OnuDetailModal detail={detail} onClose={() => setDetail(null)} />}
      {registerData && (
        <OnuRegisterModal
          board={board}
          pon={pon}
          data={registerData}
          onClose={() => setRegisterData(null)}
          onSuccess={() => fetchData(board, pon)}
        />
      )}
    </div>
  );
}