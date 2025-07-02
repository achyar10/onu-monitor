// types.ts

export interface OnuData {
    board: number;
    pon: number;
    onu_id: number;
    name: string;
    onu_type: string;
    serial_number: string;
    rx_power: string;
    status: string;
}

export interface OnuDetail extends OnuData {
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

export interface OnuDataRegister {
    onu_id: number;
    serial_number?: string;
    status?: string;
    region?: string;  // ⬅️ Tambahkan ini
    code?: string;    // ⬅️ Tambahkan ini
    vlan_id?: number;
  }