import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import FilterTabs from '../components/FilterTabs';
import TextField from '../components/TextField';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { colors, radius, spacing, type } from '../theme';
import { ATTENDANCE_SORT_OPTIONS } from '../constants/lists';

// Attendance screen: track courses, mark attendance, and run simulations
export default function AttendanceScreen({
  courses,
  threshold,
  onBack,
  onMarkPresent,
  onMarkAbsent,
  onOpenMarks,
  lastAction,
  onUndo,
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('risk');
  const [expandedId, setExpandedId] = useState(null);

  // Overall attendance calculations
  const trackedCourses = courses.filter((c) => c.held > 0);
  const totalAttended = trackedCourses.reduce((sum, c) => sum + c.attended, 0);
  const totalHeld = trackedCourses.reduce((sum, c) => sum + c.held, 0);
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 0;

  const belowCount = trackedCourses.filter(
    (c) => Math.round((c.attended / c.held) * 100) < threshold
  ).length;

  const filters = [
    { id: 'all', label: 'All', count: courses.length },
    { id: 'below', label: 'Below', count: belowCount },
    { id: 'safe', label: 'Safe', count: courses.length - belowCount },
  ];

  // Filter and sort the courses list
  const visibleCourses = useMemo(() => {
    const search = query.trim().toLowerCase();

    const matched = courses.filter((course) => {
      const matchesSearch =
        search === '' ||
        course.name.toLowerCase().includes(search) ||
        course.code.toLowerCase().includes(search) ||
        course.instructor.toLowerCase().includes(search);

      if (!matchesSearch) return false;

      const pct = course.held > 0 ? Math.round((course.attended / course.held) * 100) : 0;
      if (filter === 'below') return course.held > 0 && pct < threshold;
      if (filter === 'safe') return course.held > 0 && pct >= threshold;
      return true;
    });

    return [...matched].sort((a, b) => {
      if (sort === 'risk') {
        const pa = a.held > 0 ? a.attended / a.held : 1;
        const pb = b.held > 0 ? b.attended / b.held : 1;
        return pa - pb;
      }
      return a.code.localeCompare(b.code);
    });
  }, [courses, query, filter, sort, threshold]);

  const toggleCard = (courseId) =>
    setExpandedId((current) => (current === courseId ? null : courseId));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title="Attendance Tracker"
        subtitle={`Required threshold: ${threshold}%`}
        onBack={onBack}
      />

      {/* Undo banner if attendance was just marked */}
      {lastAction ? (
        <View style={styles.undo}>
          <Text style={styles.undoText} numberOfLines={2}>
            {lastAction.label}
          </Text>
          <TouchableOpacity onPress={onUndo} hitSlop={8}>
            <Text style={styles.undoAction}>Undo</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Summary stats */}
      <View style={styles.tiles}>
        <StatCard
          label="Overall"
          value={overallPct}
          unit="%"
          caption={`${totalAttended} / ${totalHeld} classes`}
          tone={overallPct < threshold ? 'danger' : 'safe'}
        />
        <StatCard
          label="At Risk"
          value={belowCount}
          caption={`${courses.length - belowCount} courses in good standing`}
          tone={belowCount > 0 ? 'danger' : 'safe'}
        />
      </View>

      {/* Search and Filters */}
      <View style={styles.controls}>
        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder="Search course or teacher..."
          label="Search"
          autoCapitalize="none"
        />
        <FilterTabs label="Filter by Status" options={filters} value={filter} onChange={setFilter} />
        <FilterTabs label="Sort by" options={ATTENDANCE_SORT_OPTIONS} value={sort} onChange={setSort} />
      </View>

      {/* Course Cards List */}
      {courses.length === 0 ? (
        <EmptyState
          icon="◧"
          title="No courses found"
          message="No courses are registered in your semester."
        />
      ) : visibleCourses.length === 0 ? (
        <EmptyState
          icon="⌕"
          title="No matches found"
          message="Try changing the search query or filter."
          actionLabel="Reset filters"
          onAction={() => {
            setQuery('');
            setFilter('all');
          }}
        />
      ) : (
        <View style={styles.list}>
          <Text style={styles.count}>
            Showing {visibleCourses.length} of {courses.length} courses
          </Text>
          {visibleCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              threshold={threshold}
              expanded={expandedId === course.id}
              onToggle={() => toggleCard(course.id)}
              onMarkPresent={() => onMarkPresent(course.id)}
              onMarkAbsent={() => onMarkAbsent(course.id)}
              onOpenMarks={() => onOpenMarks(course.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  undo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  undoText: {
    ...type.small,
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  undoAction: {
    ...type.small,
    fontWeight: '700',
    color: colors.primary,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  controls: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  count: {
    ...type.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
