import React from 'react';
import { View, Text } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useAppSelector } from '../../store/hooks';

export function OfflineBanner() {
  const isOffline = useAppSelector((state) => state.ui.offlineBannerVisible);

  if (!isOffline) return null;

  return (
    <View className="bg-marker/20 border-b border-marker/40 px-4 py-2 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <WifiOff size={14} color="#8a8d85" />
        <Text className="font-mono text-xs font-bold text-ink">
          Offline Mode Active
        </Text>
      </View>
      <Text className="font-mono text-[10px] text-graphite">
        Changes queued in local ledger
      </Text>
    </View>
  );
}

export default OfflineBanner;
