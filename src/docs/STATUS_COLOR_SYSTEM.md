
# Status Color System Documentation

This document outlines the status-based color system implemented for the Plant & Equipment Log Management System.

## Core Status Colors

Our application uses a semantic color system to consistently represent different status states:

| Status | Color | Hex Code | Description | Timeframe |
|--------|-------|----------|-------------|-----------|
| Expired | Red | #FF3B30 | Indicates expired or critical issues | 0 days or past expiry |
| Urgent | Orange | #FF9500 | Requires urgent attention | 1-7 days to expiry |
| Warning | Yellow | #FFCC00 | Warning state | 8-30 days to expiry |
| Valid | Green | #34C759 | Valid and compliant | 31+ days to expiry |
| Inactive | Grey | #8E8E93 | Not applicable or inactive | N/A |

## Implementation Areas

### 1. CSS Variables

Status colors are implemented as CSS variables in both light and dark themes, allowing for consistent application across the UI while maintaining the semantic meaning in different color modes.

```css
/* Light theme */
--status-expired: 357 100% 59%; /* FF3B30 - Red */
--status-urgent: 28 100% 50%; /* FF9500 - Orange */
--status-warning: 48 100% 50%; /* FFCC00 - Yellow */
--status-valid: 142 100% 40%; /* 34C759 - Green */
--status-inactive: 240 5% 57%; /* 8E8E93 - Grey */

/* Dark theme - adjusted to maintain visibility */
--status-expired: 357 90% 65%;
--status-urgent: 28 90% 55%;
--status-warning: 48 90% 55%;
--status-valid: 142 90% 45%;
--status-inactive: 240 10% 65%;
```

### 2. Components Using Status Colors

The following components implement the status color system:

- **StatusBadge**: Compact badges for table rows and list items
- **StatusPill**: Pills with optional day counts for headers and summaries
- **StatusIndicator**: Detailed status displays with descriptions and expiry timeframes
- **StatusTimeline**: Progress bars showing time remaining with appropriate status colors
- **StatusCard**: Dashboard cards with status-colored icons and borders

### 3. Role-Based Access Control

User roles are also color-coded using the same semantic system:

- **Administrator** (Green): Full system access
- **Manager** (Yellow): Standard management access
- **Technician** (Orange): Limited operational access
- **Viewer** (Grey): Read-only access

## Usage Guidelines

### Consistency

Always use the status colors consistently:
- Red (#FF3B30) - Only for expired or critical issues
- Orange (#FF9500) - Only for items requiring urgent attention (1-7 days)
- Yellow (#FFCC00) - Only for warning states (8-30 days)
- Green (#34C759) - Only for valid/compliant states (31+ days)
- Grey (#8E8E93) - Only for inactive or not applicable states

### Accessibility

Ensure that status information is not communicated by color alone:
- Include text labels with status colors
- Use patterns or icons in addition to colors
- Ensure sufficient contrast ratios
- Test in both light and dark modes

### Context-Appropriate Indicators

Choose the appropriate status component based on context:
- Use compact indicators (badges, pills) in tables and lists
- Use comprehensive indicators with context for detailed views
- Use visual cards and progress indicators for dashboards
- Use alerts with clear descriptions for notifications

## Design Principles

- **Clarity**: Status should be immediately recognizable
- **Consistency**: Status colors should be used consistently throughout the application
- **Context**: Provide adequate context for each status

## Dark Mode Compatibility

All status colors are automatically adjusted in dark mode to maintain their semantic meaning while ensuring appropriate contrast and visibility.
