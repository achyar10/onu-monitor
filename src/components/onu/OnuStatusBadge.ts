// components/onu/OnuStatusBadge.ts
export const statusStyles: Record<string, { badgeClass: string }> = {
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

export const getRxPowerColor = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num > 0 || num === 101.07) return 'text-gray-400';
    if (num <= -26) return 'text-red-600';
    if (num <= -20) return 'text-yellow-600';
    return 'text-green-600';
};