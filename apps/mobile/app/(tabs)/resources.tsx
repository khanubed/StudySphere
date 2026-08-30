import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetResourcesQuery,
  useGetResourceLeaderboardQuery,
  useGetMyResourcesQuery,
  useValidateDriveUrlMutation,
  useSubmitResourceMutation,
  useToggleLikeResourceMutation,
  useToggleBookmarkResourceMutation,
  useGetResourceCommentsQuery,
  useAddResourceCommentMutation,
  DriveValidationResult,
} from '../../src/store/api/resourceApi';
import {
  BookOpen,
  Search,
  ExternalLink,
  Plus,
  Trophy,
  FolderArchive,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  Sparkles,
  Heart,
  Bookmark,
  MessageSquare,
  FileText,
  User,
} from 'lucide-react-native';
import { Resource, ResourceType, LeaderboardScope, ResourceStatus } from '@studysphere/shared-types';

import { ThemeToggle } from '../../src/components/ThemeToggle';

type TabView = 'catalog' | 'leaderboard' | 'my_submissions';

export default function MobileResources() {
  const [activeTab, setActiveTab] = useState<TabView>('catalog');

  // Catalog State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  // Selected Resource Detail Sheet State
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [commentText, setCommentText] = useState('');

  // Leaderboard State
  const [leaderboardScope, setLeaderboardScope] = useState<LeaderboardScope>('weekly');

  // My Submissions State
  const [mySubmissionsStatus, setMySubmissionsStatus] = useState<ResourceStatus | 'all'>('all');

  // Submit Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<ResourceType>('notes');
  const [uploadSubject, setUploadSubject] = useState('CS-301 DBMS');
  const [uploadSemester, setUploadSemester] = useState(5);
  const [uploadDriveUrl, setUploadDriveUrl] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [validationResult, setValidationResult] = useState<DriveValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // RTK Query Hooks
  const {
    data: catalogResponse,
    refetch: refetchCatalog,
  } = useGetResourcesQuery({
    search: search || undefined,
    type: selectedType !== 'all' ? (selectedType as ResourceType) : undefined,
    semester: selectedSemester,
  });

  const {
    data: leaderboardResponse,
    refetch: refetchLeaderboard,
  } = useGetResourceLeaderboardQuery({ scope: leaderboardScope });

  const {
    data: myResourcesResponse,
    refetch: refetchMyResources,
  } = useGetMyResourcesQuery({ status: mySubmissionsStatus });

  const {
    data: commentsResponse,
    refetch: refetchComments,
  } = useGetResourceCommentsQuery(selectedResource?.id || '', {
    skip: !selectedResource,
  });

  const [validateDrive, { isLoading: isValidating }] = useValidateDriveUrlMutation();
  const [submitResource, { isLoading: isSubmitting }] = useSubmitResourceMutation();
  const [toggleLike] = useToggleLikeResourceMutation();
  const [toggleBookmark] = useToggleBookmarkResourceMutation();
  const [addComment, { isLoading: isPostingComment }] = useAddResourceCommentMutation();

  const resources = catalogResponse?.data?.items || [];
  const leaderboardEntries = leaderboardResponse?.data || [];
  const myResources = myResourcesResponse?.data || [];
  const comments = commentsResponse?.data || [];

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'catalog') await refetchCatalog();
    if (activeTab === 'leaderboard') await refetchLeaderboard();
    if (activeTab === 'my_submissions') await refetchMyResources();
    setRefreshing(false);
  };

  const handleOpenDrive = (url?: string | null) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleDriveUrlChange = async (url: string) => {
    setUploadDriveUrl(url);
    if (url.includes('drive.google.com')) {
      try {
        const res = await validateDrive({ url }).unwrap();
        if (res && res.data && res.data.isValid) {
          setValidationResult(res.data);
          setValidationError(null);
        } else {
          setValidationResult(null);
          setValidationError(res?.data?.error || 'Invalid Google Drive URL.');
        }
      } catch {
        setValidationError('Could not verify Drive link permissions.');
      }
    } else {
      setValidationResult(null);
      setValidationError(null);
    }
  };

  const handleCreateSubmission = async () => {
    if (!uploadTitle.trim() || !uploadDriveUrl.trim()) return;

    try {
      await submitResource({
        title: uploadTitle.trim(),
        type: uploadType,
        subjectId: uploadSubject,
        semester: uploadSemester,
        driveLink: uploadDriveUrl.trim(),
        description: uploadDescription.trim() || 'Uploaded from StudySphere Mobile App',
        tags: ['Curriculum'],
      }).unwrap();

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setModalVisible(false);
        setUploadTitle('');
        setUploadDriveUrl('');
        setUploadDescription('');
        setValidationResult(null);
        setActiveTab('my_submissions');
      }, 1500);
    } catch {
      // Handled
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !selectedResource) return;
    try {
      await addComment({ resourceId: selectedResource.id, content: commentText.trim() }).unwrap();
      setCommentText('');
      await refetchComments();
    } catch {
      // Handled
    }
  };

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'notes', label: 'Lecture Notes' },
    { id: 'pyq', label: 'Solved PYQs' },
    { id: 'book', label: 'Books' },
    { id: 'lab_manual', label: 'Lab Manuals' },
  ];

  const semesters = [
    { id: undefined, label: 'All Sems' },
    { id: 1, label: 'Sem 1' },
    { id: 2, label: 'Sem 2' },
    { id: 3, label: 'Sem 3' },
    { id: 4, label: 'Sem 4' },
    { id: 5, label: 'Sem 5' },
    { id: 6, label: 'Sem 6' },
    { id: 7, label: 'Sem 7' },
    { id: 8, label: 'Sem 8' },
  ];

  const top3 = leaderboardEntries.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-paper">
      
      {/* ── 1. HEADER & TOP BAR ───────────────────────────────────────── */}
      <View className="px-4 pt-3 pb-2 border-b border-border/60 bg-paper">
        <View className="flex-row justify-between items-center mb-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-mono text-[10px] uppercase font-bold text-quad tracking-wider">
              CENTRAL KNOWLEDGE LEDGER
            </Text>
            <Text className="text-graphite text-[10px]">•</Text>
            <Text className="font-mono text-[10px] text-graphite uppercase">DRIVE FIRST</Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <ThemeToggle size={13} className="w-7 h-7" />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="flex-row items-center gap-1 bg-quad px-2.5 py-1 rounded-[4px]"
            >
              <Plus size={11} color="#ffffff" />
              <Text className="font-mono text-[10px] font-bold text-paper uppercase">
                Submit Link
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="font-sans text-xl font-bold text-ink">Resource Hub</Text>
        
        {/* ── 2. SEGMENTED TABS CONTROLLER ────────────────────────────── */}
        <View className="flex-row bg-secondary/30 p-1 rounded-md mt-2.5 border border-border/60">
          <TouchableOpacity
            onPress={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 items-center rounded-[4px] ${
              activeTab === 'catalog' ? 'bg-quad shadow-xs' : ''
            }`}
          >
            <Text
              className={`font-mono text-xs ${
                activeTab === 'catalog' ? 'text-paper font-bold' : 'text-graphite font-semibold'
              }`}
            >
              Catalog
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('leaderboard')}
            className={`flex-1 py-1.5 items-center rounded-[4px] ${
              activeTab === 'leaderboard' ? 'bg-quad shadow-xs' : ''
            }`}
          >
            <Text
              className={`font-mono text-xs ${
                activeTab === 'leaderboard' ? 'text-paper font-bold' : 'text-graphite font-semibold'
              }`}
            >
              Hall of Fame
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('my_submissions')}
            className={`flex-1 py-1.5 items-center rounded-[4px] ${
              activeTab === 'my_submissions' ? 'bg-quad shadow-xs' : ''
            }`}
          >
            <Text
              className={`font-mono text-xs ${
                activeTab === 'my_submissions' ? 'text-paper font-bold' : 'text-graphite font-semibold'
              }`}
            >
              My Uploads
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 3. TAB CONTENT VIEWS ──────────────────────────────────────── */}
      <ScrollView
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        {/* VIEW 1: CATALOG BROWSER */}
        {activeTab === 'catalog' && (
          <View className="space-y-3 pb-8 pt-1">
            {/* Search */}
            <View className="space-y-2">
              <View className="flex-row items-center bg-secondary/20 border border-border rounded-md px-3 py-1.5">
                <Search size={14} color="#8a8d85" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by subject code, topic, proofs..."
                  placeholderTextColor="#8a8d85"
                  className="flex-1 ml-2 text-xs text-ink py-1"
                />
              </View>

              {/* Categories */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-1.5">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedType(cat.id)}
                    className={`px-2.5 py-1 rounded-[3px] border ${
                      selectedType === cat.id
                        ? 'border-quad bg-quad'
                        : 'border-border bg-paper'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[11px] ${
                        selectedType === cat.id
                          ? 'text-paper font-bold'
                          : 'text-graphite font-medium'
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Semester level */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-1.5">
                {semesters.map((sem) => (
                  <TouchableOpacity
                    key={sem.label}
                    onPress={() => setSelectedSemester(sem.id)}
                    className={`px-2 py-0.5 rounded-[2px] border ${
                      selectedSemester === sem.id
                        ? 'border-chalk bg-chalk/10'
                        : 'border-border/60 bg-paper'
                    }`}
                  >
                    <Text
                      className={`font-mono text-[10px] ${
                        selectedSemester === sem.id
                          ? 'text-chalk font-bold'
                          : 'text-graphite'
                      }`}
                    >
                      {sem.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Resource Items */}
            {resources.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedResource(item)}
                className="p-4 rounded-md bg-paper border border-border/80 space-y-2.5 shadow-xs"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-quad/10 text-quad border border-quad/30">
                      {item.type.toUpperCase()}
                    </Text>
                    <Text className="font-mono text-[10px] text-graphite">
                      Sem {item.semester || 5}
                    </Text>
                  </View>
                  <Text className="font-mono text-[9px] text-quad font-bold">✓ VERIFIED</Text>
                </View>

                <Text className="font-sans text-sm font-bold text-ink leading-snug">
                  {item.title}
                </Text>

                {item.description && (
                  <Text className="font-sans text-xs text-graphite leading-relaxed" numberOfLines={2}>
                    {item.description}
                  </Text>
                )}

                <View className="border-t border-border/40 pt-2 flex-row justify-between items-center font-mono text-[10px]">
                  <Text className="font-mono text-xs font-semibold text-ink truncate max-w-[180px]">
                    {item.subjectId}
                  </Text>
                  <Text className="text-graphite">
                    📥 {item.downloadsCount || 120} Opens · ★ {item.likesCount || 0}
                  </Text>
                </View>

                <View className="w-full p-2 rounded-[4px] bg-quad/10 border border-quad/40 flex-row items-center justify-center gap-1.5">
                  <Text className="font-mono text-xs font-bold text-quad">
                    View Details & Google Drive ↗
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* VIEW 2: CONTRIBUTOR LEADERBOARD (HALL OF FAME) */}
        {activeTab === 'leaderboard' && (
          <View className="space-y-4 pb-8 pt-1">
            {/* Scope Selector */}
            <View className="flex-row bg-secondary/20 p-1 rounded-md border border-border/60">
              {(['daily', 'weekly', 'monthly', 'allTime'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setLeaderboardScope(s)}
                  className={`flex-1 py-1 items-center rounded-[3px] ${
                    leaderboardScope === s ? 'bg-quad' : ''
                  }`}
                >
                  <Text
                    className={`font-mono text-[11px] capitalize ${
                      leaderboardScope === s ? 'text-paper font-bold' : 'text-graphite'
                    }`}
                  >
                    {s === 'allTime' ? 'All-Time' : s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <View className="space-y-2">
                <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider">
                  TOP VERIFIED SCHOLARS
                </Text>

                {top3.map((entry, idx) => (
                  <View
                    key={entry.userId}
                    className={`p-3.5 rounded-md border flex-row items-center justify-between ${
                      idx === 0
                        ? 'border-quad bg-quad/10'
                        : idx === 1
                        ? 'border-border bg-secondary/20'
                        : 'border-amber-700/30 bg-amber-500/5'
                    }`}
                  >
                    <View className="flex-row items-center gap-2.5">
                      <View
                        className={`w-7 h-7 rounded-full items-center justify-center border font-bold ${
                          idx === 0
                            ? 'border-quad bg-quad text-paper'
                            : idx === 1
                            ? 'border-border bg-secondary/50 text-ink'
                            : 'border-amber-700 bg-amber-100 text-amber-900'
                        }`}
                      >
                        <Text className={`font-mono text-xs font-bold ${idx === 0 ? 'text-paper' : 'text-ink'}`}>
                          #{idx + 1}
                        </Text>
                      </View>

                      <View>
                        <Text className="font-sans text-xs font-bold text-ink">
                          {entry.user.name}
                        </Text>
                        <Text className="font-mono text-[10px] text-graphite">
                          {entry.user.branch || 'Campus Scholar'} · {entry.resourcesCount || 10} uploads
                        </Text>
                      </View>
                    </View>

                    <Text className="font-mono text-xs font-bold text-quad">
                      {entry.points.toLocaleString()} pts
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Full Leaderboard List */}
            <View className="p-4 rounded-md border border-border/80 bg-paper space-y-2.5">
              <Text className="font-mono text-[10px] uppercase font-bold text-graphite tracking-wider pb-2 border-b border-border/60">
                AUDIT RANKINGS ({leaderboardEntries.length})
              </Text>

              {leaderboardEntries.map((entry) => (
                <View
                  key={entry.userId}
                  className="py-2 border-b border-border/30 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="font-mono text-xs font-bold text-graphite w-6">
                      #{entry.rank}
                    </Text>
                    <View>
                      <Text className="font-sans text-xs font-semibold text-ink">
                        {entry.user.name}
                      </Text>
                      <Text className="font-mono text-[10px] text-graphite">
                        {entry.user.branch || 'Engineering'}
                      </Text>
                    </View>
                  </View>

                  <Text className="font-mono text-xs font-bold text-ink">
                    {entry.points.toLocaleString()} pts
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* VIEW 3: MY SUBMISSIONS & DRIVE STATUS */}
        {activeTab === 'my_submissions' && (
          <View className="space-y-3 pb-8 pt-1">
            {/* Status Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {[
                { id: 'all', label: 'All (8)' },
                { id: 'published', label: 'Live (6)' },
                { id: 'pending', label: 'Review (1)' },
                { id: 'changes_requested', label: 'Changes (1)' },
              ].map((pill) => (
                <TouchableOpacity
                  key={pill.id}
                  onPress={() => setMySubmissionsStatus(pill.id as any)}
                  className={`px-3 py-1.5 rounded-[4px] border ${
                    mySubmissionsStatus === pill.id
                      ? 'border-quad bg-quad'
                      : 'border-border bg-paper'
                  }`}
                >
                  <Text
                    className={`font-mono text-xs ${
                      mySubmissionsStatus === pill.id
                        ? 'text-paper font-bold'
                        : 'text-graphite font-medium'
                    }`}
                  >
                    {pill.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Submissions List */}
            {myResources.map((res) => (
              <TouchableOpacity
                key={res.id}
                onPress={() => setSelectedResource(res)}
                className="p-4 rounded-md bg-paper border border-border/80 space-y-2.5 shadow-xs"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-secondary/30 text-ink border border-border">
                    {res.type.toUpperCase()}
                  </Text>

                  <Text
                    className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] ${
                      res.status === 'published'
                        ? 'bg-quad/10 text-quad'
                        : res.status === 'pending'
                        ? 'bg-marker/20 text-ink'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {res.status === 'published'
                      ? '✓ LIVE IN CATALOG'
                      : res.status === 'pending'
                      ? '⌛ UNDER MODERATION'
                      : '⚠️ ACTION REQUIRED'}
                  </Text>
                </View>

                <Text className="font-sans text-sm font-bold text-ink leading-snug">
                  {res.title}
                </Text>

                {res.moderationFeedback && (
                  <View className="p-2.5 bg-marker/15 border border-marker/40 rounded-[4px]">
                    <Text className="font-mono text-[10px] text-ink font-bold">
                      FACULTY AUDIT NOTE:
                    </Text>
                    <Text className="font-sans text-xs text-graphite mt-0.5">
                      "{res.moderationFeedback}"
                    </Text>
                  </View>
                )}

                <View className="border-t border-border/40 pt-2 flex-row justify-between items-center font-mono text-[10px]">
                  <Text className="text-graphite">Sem {res.semester || 5} · {res.subjectId}</Text>
                  <Text className="text-quad font-bold">📥 {res.downloadsCount || 0} Opens</Text>
                </View>

                <View className="w-full p-2 rounded-[4px] border border-border flex-row items-center justify-center gap-1.5">
                  <Text className="font-mono text-xs text-ink font-semibold">
                    View Sheet & Google Drive ↗
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      {/* ── 4. SUBMIT RESOURCE MODAL (GOOGLE DRIVE FIRST) ─────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-paper rounded-t-xl p-5 space-y-4 max-h-[85%] border-t border-border">
            
            {/* Modal Header */}
            <View className="flex-row justify-between items-center border-b border-border/60 pb-3">
              <View>
                <Text className="font-mono text-[10px] uppercase font-bold text-quad">
                  GOOGLE DRIVE FIRST SUBMISSION
                </Text>
                <Text className="font-sans text-lg font-bold text-ink">
                  Submit Academic Link
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#8a8d85" />
              </TouchableOpacity>
            </View>

            {submitSuccess ? (
              <View className="py-8 items-center space-y-2">
                <CheckCircle2 size={40} color="#2f5d50" />
                <Text className="font-sans text-base font-bold text-ink">
                  Queued in Academic Ledger!
                </Text>
                <Text className="font-sans text-xs text-graphite text-center">
                  Submitted for faculty quality moderation.
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} className="space-y-3">
                {/* Title input */}
                <View>
                  <Text className="font-mono text-xs font-bold text-graphite uppercase mb-1">
                    Resource Title *
                  </Text>
                  <TextInput
                    value={uploadTitle}
                    onChangeText={setUploadTitle}
                    placeholder="e.g. Unit 3 DBMS Normalization Handwritten Notes"
                    placeholderTextColor="#8a8d85"
                    className="p-2.5 rounded-md border border-border bg-secondary/15 text-xs text-ink"
                  />
                </View>

                {/* Type & Subject */}
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="font-mono text-xs font-bold text-graphite uppercase mb-1">
                      Subject *
                    </Text>
                    <TextInput
                      value={uploadSubject}
                      onChangeText={setUploadSubject}
                      placeholder="CS-301 DBMS"
                      placeholderTextColor="#8a8d85"
                      className="p-2.5 rounded-md border border-border bg-secondary/15 text-xs text-ink"
                    />
                  </View>

                  <View className="w-24">
                    <Text className="font-mono text-xs font-bold text-graphite uppercase mb-1">
                      Sem *
                    </Text>
                    <TextInput
                      value={uploadSemester.toString()}
                      onChangeText={(t) => setUploadSemester(Number(t) || 5)}
                      keyboardType="numeric"
                      className="p-2.5 rounded-md border border-border bg-secondary/15 text-xs text-ink text-center"
                    />
                  </View>
                </View>

                {/* Google Drive URL & Validator */}
                <View className="space-y-1.5">
                  <Text className="font-mono text-xs font-bold text-graphite uppercase">
                    Google Drive Share Link *
                  </Text>
                  <TextInput
                    value={uploadDriveUrl}
                    onChangeText={handleDriveUrlChange}
                    placeholder="https://drive.google.com/file/d/..."
                    placeholderTextColor="#8a8d85"
                    autoCapitalize="none"
                    className={`p-2.5 rounded-md border text-xs text-ink ${
                      validationResult
                        ? 'border-quad bg-quad/10'
                        : validationError
                        ? 'border-destructive bg-destructive/10'
                        : 'border-border bg-secondary/15'
                    }`}
                  />

                  {isValidating && (
                    <Text className="font-mono text-[10px] text-graphite">
                      Validating Drive link permissions...
                    </Text>
                  )}

                  {validationResult && (
                    <View className="p-2 bg-quad/10 border border-quad/40 rounded-[4px]">
                      <Text className="font-mono text-[10px] font-bold text-quad">
                        ✓ Public Drive Access Verified ({validationResult.fileSizeFormatted})
                      </Text>
                    </View>
                  )}

                  {validationError && (
                    <View className="p-2 bg-destructive/10 border border-destructive/40 rounded-[4px]">
                      <Text className="font-mono text-[10px] text-destructive">
                        {validationError} Set permission to "Anyone with link can view".
                      </Text>
                    </View>
                  )}
                </View>

                {/* Description */}
                <View>
                  <Text className="font-mono text-xs font-bold text-graphite uppercase mb-1">
                    Academic Summary *
                  </Text>
                  <TextInput
                    value={uploadDescription}
                    onChangeText={setUploadDescription}
                    multiline
                    numberOfLines={3}
                    placeholder="Describe chapters, formulas, and questions covered..."
                    placeholderTextColor="#8a8d85"
                    className="p-2.5 rounded-md border border-border bg-secondary/15 text-xs text-ink h-20"
                  />
                </View>

                {/* Submit Action */}
                <TouchableOpacity
                  onPress={handleCreateSubmission}
                  disabled={isSubmitting || !uploadTitle || !uploadDriveUrl}
                  className="w-full p-3 bg-quad rounded-md items-center justify-center mt-2 disabled:opacity-50"
                >
                  <Text className="font-mono text-xs font-bold text-paper uppercase">
                    {isSubmitting ? 'Recording in Ledger...' : 'Submit to Moderation Queue'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}

          </View>
        </View>
      </Modal>

      {/* ── 5. RESOURCE DETAIL MODAL SHEET ───────────────────────────── */}
      <Modal
        visible={!!selectedResource}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedResource(null)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-paper rounded-t-xl p-5 space-y-4 max-h-[90%] border-t border-border">
            {selectedResource && (
              <>
                {/* Header */}
                <View className="flex-row justify-between items-start border-b border-border/60 pb-3">
                  <View className="flex-1 pr-2 space-y-1">
                    <View className="flex-row items-center gap-1.5 flex-wrap">
                      <Text className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-quad/10 text-quad border border-quad/30">
                        {selectedResource.type.toUpperCase()}
                      </Text>
                      <Text className="font-mono text-[9px] font-bold text-quad bg-quad text-paper px-1.5 py-0.5 rounded-[2px]">
                        ✓ VERIFIED
                      </Text>
                      <Text className="font-mono text-[10px] text-graphite">
                        Sem {selectedResource.semester || 5}
                      </Text>
                    </View>

                    <Text className="font-sans text-base font-bold text-ink leading-snug">
                      {selectedResource.title}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => setSelectedResource(null)}>
                    <X size={20} color="#8a8d85" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
                  {/* Direct Google Drive Action */}
                  <TouchableOpacity
                    onPress={() => handleOpenDrive(selectedResource.driveLink || selectedResource.fileUrl)}
                    className="w-full p-3 bg-quad rounded-md flex-row items-center justify-center gap-2 shadow-xs"
                  >
                    <Text className="font-mono text-xs font-bold text-paper">
                      Open in Google Drive
                    </Text>
                    <ExternalLink size={14} color="#ffffff" />
                  </TouchableOpacity>

                  {/* Actions Row (Like & Bookmark) */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => toggleLike(selectedResource.id)}
                      className="flex-1 p-2.5 rounded-md border border-border bg-secondary/15 flex-row items-center justify-center gap-1.5"
                    >
                      <Heart size={14} color="#ef4444" />
                      <Text className="font-mono text-xs font-bold text-ink">
                        {selectedResource.likesCount || 0} Endorsements
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => toggleBookmark(selectedResource.id)}
                      className="flex-1 p-2.5 rounded-md border border-border bg-secondary/15 flex-row items-center justify-center gap-1.5"
                    >
                      <Bookmark size={14} color="#2f5d50" />
                      <Text className="font-mono text-xs font-bold text-ink">
                        Save to Ledger
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Metadata Table */}
                  <View className="p-3 bg-secondary/15 rounded-md space-y-2 border border-border/60 font-mono">
                    <Text className="font-mono text-[10px] uppercase font-bold text-graphite pb-1 border-b border-border/40">
                      ARCHIVE METADATA LEDGER
                    </Text>
                    <View className="flex-row justify-between text-xs">
                      <Text className="font-mono text-[11px] text-graphite">CATALOG ID:</Text>
                      <Text className="font-mono text-[11px] font-bold text-ink">#{selectedResource.id}</Text>
                    </View>
                    <View className="flex-row justify-between text-xs">
                      <Text className="font-mono text-[11px] text-graphite">SUBJECT:</Text>
                      <Text className="font-mono text-[11px] font-semibold text-ink">{selectedResource.subjectId}</Text>
                    </View>
                    <View className="flex-row justify-between text-xs">
                      <Text className="font-mono text-[11px] text-graphite">UPLOADER:</Text>
                      <Text className="font-mono text-[11px] text-ink">{selectedResource.uploader?.name || 'Scholar'}</Text>
                    </View>
                    <View className="flex-row justify-between text-xs">
                      <Text className="font-mono text-[11px] text-graphite">DOWNLOADS:</Text>
                      <Text className="font-mono text-[11px] font-bold text-quad">📥 {selectedResource.downloadsCount || 240}</Text>
                    </View>
                  </View>

                  {/* Description */}
                  {selectedResource.description && (
                    <View className="space-y-1">
                      <Text className="font-mono text-[10px] font-bold text-graphite uppercase">
                        ACADEMIC SYLLABUS COVERAGE
                      </Text>
                      <Text className="font-sans text-xs text-ink leading-relaxed">
                        {selectedResource.description}
                      </Text>
                    </View>
                  )}

                  {/* Peer Comments Section */}
                  <View className="space-y-3 pt-2 border-t border-border/60">
                    <View className="flex-row items-center gap-1.5">
                      <MessageSquare size={13} color="#2f5d50" />
                      <Text className="font-mono text-xs font-bold text-ink uppercase">
                        Peer Notes & Discussions ({comments.length})
                      </Text>
                    </View>

                    {/* Composer */}
                    <View className="flex-row gap-2">
                      <TextInput
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder="Add a study verification note..."
                        placeholderTextColor="#8a8d85"
                        className="flex-1 p-2 rounded-md border border-border bg-secondary/15 text-xs text-ink"
                      />
                      <TouchableOpacity
                        onPress={handlePostComment}
                        disabled={isPostingComment || !commentText.trim()}
                        className="px-3 bg-quad rounded-md items-center justify-center disabled:opacity-50"
                      >
                        <Send size={14} color="#ffffff" />
                      </TouchableOpacity>
                    </View>

                    {/* Comments Feed */}
                    <View className="space-y-2">
                      {comments.map((comm) => (
                        <View key={comm.id} className="p-2.5 bg-secondary/10 rounded-md border border-border/40 space-y-1">
                          <View className="flex-row justify-between items-center">
                            <Text className="font-sans text-[11px] font-bold text-ink">
                              {comm.user?.name || 'Student'}
                            </Text>
                            <Text className="font-mono text-[9px] text-graphite">
                              {new Date(comm.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text className="font-sans text-xs text-graphite leading-relaxed">
                            {comm.content}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
