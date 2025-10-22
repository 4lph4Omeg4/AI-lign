# AI-lign Data Persistence Guide

## Overview
AI-lign uses **localStorage** to permanently save all user data, including profile settings, matches, and chat history. This means your data persists across browser sessions and page refreshes.

## What Gets Saved Permanently

### 1. **User Profiles** 
- **Location**: `localStorage['ai-lign-all-users']`
- **Data Includes**:
  - Profile information (name, age, bio, interests, photo)
  - Likes and dislikes
  - Matches with timestamps
  - View counts
- **Syncing**: Your profile automatically syncs to the global database whenever any changes are made

### 2. **Current User Session**
- **Location**: `localStorage['ai-lign-currentUser']`
- **Data Includes**: Complete profile of the currently logged-in user
- **Auto-sync**: Changes to your profile are automatically saved to both the current user storage and the global user database

### 3. **Chat Conversations**
- **Location**: `localStorage['ai-lign-conversations']`
- **Data Includes**:
  - All message history (text and images)
  - Message timestamps (automatically restored as Date objects)
  - Read receipts
  - Ephemeral photo status
- **Format**: Stored by conversation ID (e.g., `"1001-1002"` for chat between users 1001 and 1002)

## Recent Fixes Applied

### Conversation Glitch Fix
**Problem**: Messages were appearing and disappearing in the chat view
**Root Causes**:
1. Unstable message IDs caused duplicate React keys
2. MessageBubble component was being recreated on every render
3. Inefficient scroll behavior triggered too often

**Solutions Implemented**:
1. ✅ **Improved Message ID Generation**: Changed from a ref-based counter to `Date.now() + Math.random()` for guaranteed unique IDs across sessions
2. ✅ **Memoized Components**: Extracted and memoized `MessageBubble` and `ReadReceiptIcon` components to prevent unnecessary re-renders
3. ✅ **Optimized Scroll**: Changed scroll trigger from `[messages]` to `[messages.length]` to only scroll when new messages arrive
4. ✅ **Removed Debug Code**: Cleaned up console.log statements that could affect performance

### Profile Persistence Enhancement
**Added**: Automatic sync effect that ensures whenever the current user's profile changes, it's immediately saved to the global user database. This prevents any data loss scenarios.

## How It Works Under the Hood

### useLocalStorage Hook
The app uses a custom `useLocalStorage` hook that:
- Automatically serializes data to JSON when saving
- Deserializes data when loading
- Handles Date object restoration for timestamps
- Provides error handling for storage quota issues

### Data Flow
```
User Action → State Update → localStorage Write → Global DB Sync
     ↓                                                    ↓
 UI Update ←───────────────────────────────────── Data Persisted
```

## Storage Limits

- **Browser localStorage** typically has a 5-10 MB limit
- **Large images** are stored as URLs or object URLs, not as base64 (efficient!)
- **Quota exceeded errors** are caught and displayed to the user with helpful messages

## Data Retention

### Permanent Data
- ✅ User profiles (including yours)
- ✅ All matches
- ✅ Complete chat history
- ✅ User preferences

### Session-Only Data
- ❌ Notification counters (resets each session)
- ❌ UI state (current view, modals open, etc.)
- ❌ Typing indicators

## Clearing Data

To reset the app completely:
```javascript
// Open browser console and run:
localStorage.removeItem('ai-lign-all-users');
localStorage.removeItem('ai-lign-currentUser');
localStorage.removeItem('ai-lign-conversations');
// Then refresh the page
```

Or use browser DevTools → Application → Local Storage → Delete specific items

## Testing Persistence

1. **Create or login to an account**
2. **Make some matches and send messages**
3. **Close the browser completely** (not just the tab)
4. **Reopen the browser and go back to the app**
5. **Login with your email** → All your data should be there!

## Backup Recommendations

While localStorage is reliable, it can be cleared by:
- Browser cache clearing
- Private/Incognito mode
- User manual deletion

For production apps, consider:
- Backend database integration
- Periodic cloud backups
- Export/Import functionality

## Technical Notes

### Date Handling
Dates are stored as ISO strings and automatically converted back to Date objects on load:
```typescript
timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
```

### Message IDs
Now use `Date.now() + Math.random()` to ensure uniqueness:
- Unique across sessions
- No conflicts on component remount
- Stable React keys = no flickering

### Sync Strategy
The app uses a "write-through cache" pattern:
- Changes immediately update state (fast UI)
- Changes are synced to localStorage (persistent)
- Global database is updated for multi-user consistency

## Troubleshooting

### "Storage quota exceeded" error
- Upload smaller profile photos
- Clear old conversations
- Use browser's storage management tools

### Data not persisting
- Check if you're in Private/Incognito mode
- Verify localStorage is enabled in browser settings
- Check browser console for errors

### Messages flickering (Fixed!)
This issue has been resolved by:
- Memoizing message components
- Using stable message IDs
- Optimizing render triggers

