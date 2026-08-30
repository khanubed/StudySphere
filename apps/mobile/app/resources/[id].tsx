import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetResourceByIdQuery, useToggleLikeResourceMutation, useToggleBookmarkResourceMutation } from '../../src/store/api/resourceApi';
import { ChevronLeft, ExternalLink, Heart, Bookmark, Share2 } from 'lucide-react-native';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: response, isLoading } = useGetResourceByIdQuery(id || 'res-001');
  const [toggleLike] = useToggleLikeResourceMutation();
  const [toggleBookmark] = useToggleBookmarkResourceMutation();

  const resource = response?.data;

  const handleOpenDrive = () => {
    if (resource?.driveLink || resource?.fileUrl) {
      Linking.openURL(resource.driveLink || resource.fileUrl || '');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      {/* Header */}
      <View className="px-4 py-3 border-b border-border/60 bg-paper flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 p-1 rounded border border-border"
        >
          <ChevronLeft size={16} color="#12151c" />
          <Text className="font-mono text-xs font-semibold text-ink">Back</Text>
        </TouchableOpacity>

        <View className="w-7 h-7" />
      </View>


      <ScrollView className="flex-1 px-4 py-4 space-y-4" showsVerticalScrollIndicator={false}>
        {/* Title & Badge */}
        <View className="space-y-1.5">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-quad/10 text-quad border border-quad/30">
              {resource?.type?.toUpperCase() || 'NOTES'}
            </Text>
            <Text className="font-mono text-[9px] font-bold text-quad bg-quad text-paper px-1.5 py-0.5 rounded-[2px]">
              ✓ VERIFIED
            </Text>
            <Text className="font-mono text-[10px] text-graphite">
              Sem {resource?.semester || 5} • {resource?.subjectId}
            </Text>
          </View>

          <Text className="font-sans text-lg font-bold text-ink">
            {resource?.title || 'Relational Database Management Lecture Notes'}
          </Text>
        </View>

        {/* Action Primary Button */}
        <TouchableOpacity
          onPress={handleOpenDrive}
          className="w-full p-3 bg-quad rounded-md flex-row items-center justify-center gap-2"
        >
          <Text className="font-mono text-xs font-bold text-paper">
            Open in Google Drive
          </Text>
          <ExternalLink size={14} color="#ffffff" />
        </TouchableOpacity>

        {/* Social Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => id && toggleLike(id)}
            className="flex-1 p-2.5 rounded-md border border-border bg-secondary/15 flex-row items-center justify-center gap-1.5"
          >
            <Heart size={14} color="#ef4444" />
            <Text className="font-mono text-xs font-bold text-ink">
              {resource?.likesCount || 0} Endorse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => id && toggleBookmark(id)}
            className="flex-1 p-2.5 rounded-md border border-border bg-secondary/15 flex-row items-center justify-center gap-1.5"
          >
            <Bookmark size={14} color="#2f5d50" />
            <Text className="font-mono text-xs font-bold text-ink">
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Metadata Ledger */}
        <View className="p-3.5 bg-secondary/15 rounded-md border border-border/60 font-mono space-y-2">
          <Text className="font-mono text-[10px] uppercase font-bold text-graphite pb-1 border-b border-border/40">
            METADATA AUDIT
          </Text>
          <View className="flex-row justify-between text-xs">
            <Text className="text-graphite">CATALOG ID:</Text>
            <Text className="font-bold text-ink">#{resource?.id || id}</Text>
          </View>
          <View className="flex-row justify-between text-xs">
            <Text className="text-graphite">UPLOADER:</Text>
            <Text className="text-ink">{resource?.uploader?.name || 'Faculty Scholar'}</Text>
          </View>
          <View className="flex-row justify-between text-xs">
            <Text className="text-graphite">OPENS:</Text>
            <Text className="font-bold text-quad">📥 {resource?.downloadsCount || 280}</Text>
          </View>
        </View>

        {/* Description */}
        {resource?.description && (
          <View className="space-y-1">
            <Text className="font-mono text-[10px] uppercase font-bold text-graphite">
              SYLLABUS COVERAGE
            </Text>
            <Text className="font-sans text-xs text-graphite leading-relaxed">
              {resource.description}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
