---
name: Habit Template Library with Tracking
overview: Implement a checkbox-based habit template library with categories, custom habit management, and comprehensive tracking (frequency, streaks, trends) while preserving the existing text field for additional notes.
todos:
  - id: create-habits-lib
    content: Create lib/habits.ts with Habit types, default template, and tracking utilities
    status: pending
  - id: update-audit-entry
    content: Update AuditEntry interface to include checkedHabits array and update storage logic
    status: pending
    dependencies:
      - create-habits-lib
  - id: build-habit-selection-ui
    content: Add categorized checkbox groups for habit selection in nightly-audit page
    status: pending
    dependencies:
      - update-audit-entry
  - id: custom-habit-management
    content: Implement add/edit/delete functionality for custom habits with modal UI
    status: pending
    dependencies:
      - build-habit-selection-ui
  - id: tracking-calculations
    content: Build tracking utilities for frequency, streaks, and trends calculations
    status: pending
    dependencies:
      - create-habits-lib
  - id: tracking-dashboard
    content: Create tracking dashboard UI showing frequency, streaks, and trends with visualizations
    status: pending
    dependencies:
      - tracking-calculations
      - build-habit-selection-ui
---

# Habit Template Library with Tracking

## Overview

Transform the "bad habits checked" field from free-form text to a structured checkbox system with a template library, custom habit management, and comprehensive tracking analytics.

## Data Structure Changes

### New Types & Interfaces

Create `lib/habits.ts` with:

- `Habit` interface: `{ id: string, name: string, category: string, isCustom: boolean, createdAt?: string }`
- `HabitCategory type: predefined categories (Digital, Social, Work, Health, Mental, Other)
- `HabitTracking` interface: track which habits were checked on which dates
- Default template habits (Stoic-focused examples)

### Update AuditEntry Interface

Modify `app/nightly-audit/page.tsx`:

- Add `checkedHabits: string[]` (array of habit IDs) to `AuditEntry`
- Keep `badHabitsChecked: string` for backward compatibility and notes
- Add `habitTracking` data structure for analytics

### Storage Structure

- `habits-library`: stores all habits (template + custom)
- `habit-tracking-{date}`: daily tracking of checked habits
- Existing `nightly-audit-{date}` entries updated to include `checkedHabits`

## UI Components

### Habit Selection Section

In `app/nightly-audit/page.tsx`:

- Add categorized checkbox groups above the existing text field
- Each category in a collapsible section
- Checkboxes with habit names
- Visual indicator for custom vs template habits
- "Add Custom Habit" button/modal

### Habit Management

- Modal/drawer for adding custom habits (name + category)
- Edit/delete functionality for custom habits only
- Settings/preferences area for habit management

### Tracking Dashboard

New section or separate view showing:

- **Frequency**: Count and percentage of times each habit was checked
- **Streaks**: Current and longest streaks per habit
- **Trends**: Weekly/monthly charts showing habit checking patterns
- Filter by category, date range

## Implementation Steps

1. **Create habits library** (`lib/habits.ts`)

- Define types and interfaces
- Default template habits with Stoic focus
- Storage utilities for habits library
- Tracking data utilities

2. **Update AuditEntry data model**

- Add `checkedHabits` field
- Migration logic for existing entries
- Update save/load logic

3. **Build habit selection UI**

- Categorized checkbox groups
- Integration with existing form
- Preserve text field for notes

4. **Implement custom habit management**

- Add/edit/delete custom habits
- Persist to habits library
- Update UI when habits change

5. **Build tracking analytics**

- Calculate frequency metrics
- Calculate streak data
- Generate trend data
- Create visualization components

6. **Add tracking dashboard view**

- New section in nightly audit page or separate route
- Display all analytics
- Filtering and date range selection

## Files to Modify

- `app/nightly-audit/page.tsx` - Main UI updates
- `lib/storage.ts` - Add habit-specific storage utilities (or extend existing)
- `lib/habits.ts` - New file for habit types, templates, and tracking logic

## Default Template Habits

Stoic-focused categories with examples:

- **Digital**: Phone checking, Social media scrolling, Mindless browsing
- **Social**: Complaining, Gossip, Interrupting others
- **Work**: Procrastination, Multitasking, Perfectionism
- **Health**: Skipping exercise, Poor sleep habits, Unhealthy eating
- **Mental**: Catastrophizing, Rumination, Negative self-talk

## Technical Considerations

- Backward compatibility: existing entries without `checkedHabits` still work
- Performance: efficient tracking calculations (cache where possible)