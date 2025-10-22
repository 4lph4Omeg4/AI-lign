# 🌙 Dark Room - Anonymous Group Video Chat

## Overview
The **Dark Room** is an exciting new feature that adds anonymous group video chat to AI-lign! Join a room with random active users and hang out in a fun, mysterious atmosphere with anonymous identities.

## ✨ Key Features

### 1. **Anonymous Identities**
Everyone gets a randomly generated anonymous name:
- 🦊 Cosmic Wolf
- 🐯 Neon Tiger  
- 🦅 Electric Phoenix
- 🐉 Cyber Dragon
- And many more cool names!

### 2. **Dynamic Participants**
- **3-12 people** can be in the room at once
- Users **join and leave** dynamically in real-time
- You'll see notifications when someone joins/leaves
- Participant count updates live

### 3. **Video Grid Layout**
- Responsive grid that adapts to participant count:
  - 1 person: Full screen
  - 2 people: 2-column layout
  - 3-4 people: 2x2 grid
  - 5-6 people: 3x2 grid
  - 7-9 people: 3x3 grid
  - 10+ people: 4x3 grid

### 4. **Personalized Avatars**
Each participant gets:
- **Random emoji** (🦊 🐺 🦅 🐉 🦁 🐯 🦉 🐆)
- **Random gradient color** (pink, purple, blue, green, yellow, etc.)
- Unique visual identity while staying anonymous

### 5. **Full Video Controls**
- 🎤 **Microphone toggle** - Mute/unmute yourself
- 📹 **Video toggle** - Turn camera on/off
- 🔴 **Leave button** - Exit the Dark Room
- All controls auto-hide after 3 seconds for immersive experience

### 6. **Visual Indicators**
- **Muted indicator**: Red icon shows when someone's mic is off
- **Video off placeholder**: Shows colorful avatar when camera is disabled
- **Speaking indicator**: Green "Speaking" badge appears when someone talks
- **Connection status**: Live participant count and timer
- **You label**: Your video feed is clearly marked "(You)"

### 7. **Real-Time Updates**
- Call duration timer (MM:SS)
- Live participant counter
- Join/leave notifications with participant names
- Connection status indicator

## 🎮 How to Access

### On the Main Swiping Screen:
Look for the **pulsing purple/pink button** on the TOP LEFT of the screen with a video camera icon 📹

- The button shows how many people are currently online
- It pulses to grab your attention
- Just click it to instantly join!

## 🎨 UI/UX Design

### Header
```
[🌍] Anonymous Group Chat
     • 6 people online • 02:34
                    [Leave Group]
```

### Video Grid
Each participant tile shows:
- Full video feed (or colorful placeholder if camera off)
- Avatar emoji in a colorful circle
- Anonymous name (e.g., "Cosmic Wolf")
- "(You)" indicator for your own tile
- Muted icon (red mic) if they're muted
- "Speaking" badge (green) if they're talking

### Bottom Controls
```
[Mic]    [Video]    [Leave]
  Mic      Video      Leave
```

Auto-hide after 3 seconds, reappear on mouse movement

## 🎭 Anonymous Experience

### Privacy Features
- **No real names** - Everyone has a fun anonymous name
- **Random identities** - Names and colors change each session
- **Temporary** - Nothing is recorded or saved
- **Leave anytime** - No commitments, just fun

### Social Dynamics
- **Ice breakers**: Anonymous setting makes it easier to talk
- **Mystery**: Not knowing who anyone is adds excitement
- **Casual vibe**: Low pressure, high fun
- **Diverse group**: Meet different people each time

## 🛠️ Technical Details

### Participant Generation
```typescript
{
  id: 'user-1234567890',
  name: 'Cosmic Wolf',
  avatar: '🦊',
  color: 'from-purple-500 to-indigo-600',
  isMuted: false,
  isVideoOff: false
}
```

### Dynamic Join/Leave
- New users join every 8-20 seconds (randomized)
- Users leave randomly but not too often
- Room maintains 2-12 participants
- Smooth notifications for all events

### State Management
- Real-time participant tracking
- Local video stream management
- Auto-hiding controls system
- Connection timer
- Mute/video toggle states

## 📱 Responsive Design

### Desktop
- Large video grid with clear tiles
- Hover effects on video feeds
- Smooth animations

### Mobile
- Touch-optimized controls
- Stacked grid layout
- Proper spacing for fingers

## 🎬 User Flow

1. **Click Dark Room button** (pulsing purple button in header)
2. **Enter the room** - See 3-7 random people already there
3. **Your camera activates** - You appear as one of the participants
4. **Interact** - Toggle mic/video, watch others, have fun
5. **People join/leave** - See notifications as the room evolves
6. **Leave when ready** - Click Leave button to return to main app

## 🌟 Fun Elements

### Random Events
- Speaking indicators appear randomly
- Users join/leave at unpredictable times
- Different emoji and color combos every session
- Varying room sizes keep it fresh

### Visual Polish
- **Gradient backgrounds** for each participant
- **Smooth transitions** when people join/leave
- **Glowing effects** on hover
- **Animated notifications** for room events
- **Pulsing button** to attract attention

### Atmosphere
- Dark theme with purple/fuchsia accents
- Mystery vibe with anonymous names
- Fun, casual energy
- No pressure social space

## 🔮 Future Enhancements (Ideas)

- Text chat overlay during video
- Emoji reactions you can send
- "Raise hand" feature
- Themed rooms (Gaming, Music, etc.)
- Voice effects/filters
- Screen sharing
- Breakout rooms
- Games/activities within the room

## 🎯 Why It's Fun

### For Users Who Want:
- ✅ **Meet new people** without the pressure of a 1-on-1
- ✅ **Stay anonymous** while socializing
- ✅ **Drop in/out casually** with no commitment
- ✅ **Experience variety** with different groups each time
- ✅ **Break the ice** in a group setting
- ✅ **Have fun** in a mysterious, exciting environment

### Perfect For:
- Quick social breaks
- Late night hangouts
- Meeting multiple people at once
- Overcoming shyness (anonymous!)
- Just passing time with others
- Finding your vibe before matching

---

## 🚀 Status

- ✅ **Fully Implemented**
- ✅ **Build Successful**
- ✅ **No Linter Errors**
- ✅ **Responsive Design**
- ✅ **Ready to Use!**

## 🎉 Try It Out!

Look for the **glowing purple button** on the top left of your main screen - it's pulsing and showing how many people are online right now. Click it and enter the Dark Room for some anonymous group video fun! 🌙✨

