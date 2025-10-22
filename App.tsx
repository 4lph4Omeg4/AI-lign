import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Message } from './types';

import ProfileSetup from './components/ProfileSetup';
import EditProfile from './components/EditProfile';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import ActionButton from './components/ActionButton';
import MatchModal from './components/MatchModal';
import MatchAnimation from './components/MatchAnimation';
import ChatView from './components/ChatView';
import CompatibleModels from './components/CompatibleModels';
import PickupLineModal from './components/PickupLineModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import VideoChatView from './components/VideoChatView';
import AuthView from './components/AuthView';
import AnonymousGroupChat from './components/AnonymousGroupChat';


// A custom hook to persist state in localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;
            
            const parsed = JSON.parse(item);
            
            // Special handling for conversations to restore Date objects
            if (key === 'ai-lign-conversations' && typeof parsed === 'object') {
                Object.keys(parsed).forEach(convId => {
                    if (Array.isArray(parsed[convId])) {
                        parsed[convId] = parsed[convId].map((msg: any) => ({
                            ...msg,
                            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
                        }));
                    }
                });
            }
            
            return parsed;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

type View = 'auth' | 'profileSetup' | 'swiping' | 'chat' | 'matches' | 'editProfile' | 'videoChat' | 'groupChat';

// This simulates a global database of all users
const getAllUsers = (): UserProfile[] => {
    try {
        const users = window.localStorage.getItem('ai-lign-all-users');
        return users ? JSON.parse(users) : [];
    } catch {
        return [];
    }
};

const saveAllUsers = (users: UserProfile[]) => {
    try {
        window.localStorage.setItem('ai-lign-all-users', JSON.stringify(users));
    } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.error('Storage quota exceeded. Please clear some data or use smaller images.');
            alert('Storage limit reached. Please try uploading a smaller image or clear your browser data.');
            throw error;
        }
        throw error;
    }
};

const App: React.FC = () => {
    // Persistent State for the CURRENTLY LOGGED IN user
    const [currentUser, setCurrentUser] = useLocalStorage<UserProfile | null>('ai-lign-currentUser', null);
    
    // Non-persistent UI State
    const [swipeQueue, setSwipeQueue] = useState<UserProfile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentView, setCurrentView] = useState<View>('auth');
    const [isLoading, setIsLoading] = useState(true);
    const [isMatching, setIsMatching] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
    const [chattingWith, setChattingWith] = useState<UserProfile | null>(null);
    const [conversations, setConversations] = useLocalStorage<Record<string, Message[]>>('ai-lign-conversations', {});
    
    // Modal & Toast State
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [showPickupLineModal, setShowPickupLineModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState<{isOpen: boolean, onConfirm: () => void, title: string, message: string, confirmText: string}>({isOpen: false, onConfirm: () => {}, title: '', message: '', confirmText: 'Confirm'});
    const [toast, setToast] = useState({ show: false, message: '' });

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Seed database on first load
    useEffect(() => {
        const allUsers = getAllUsers();
        if (allUsers.length === 0) {
            const seedProfiles: UserProfile[] = [
                {
                    id: 1001,
                    email: 'jessica@example.com',
                    name: 'Jessica',
                    age: 28,
                    bio: 'Lover of art, long walks on the beach, and exploring new coffee shops. My dog is my best friend. Looking for a genuine connection and someone to share adventures with.',
                    interests: ['Art', 'Coffee', 'Hiking', 'Photography', 'Dogs'],
                    imageUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=800&auto=format&fit=crop',
                    viewCount: 204,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1002,
                    email: 'chloe@example.com',
                    name: 'Chloe',
                    age: 25,
                    bio: 'Software developer by day, gamer by night. I love a good sci-fi movie and trying new recipes. Let\'s build something amazing together, in code or in life.',
                    interests: ['Gaming', 'Sci-Fi', 'Cooking', 'Technology', 'Cats'],
                    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
                    viewCount: 351,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1003,
                    email: 'sofia@example.com',
                    name: 'Sofia',
                    age: 31,
                    bio: 'My passport has more stamps than I can count. I\'m always planning my next trip and looking for a foodie to explore the world with. Tell me the best place you\'ve ever eaten!',
                    interests: ['Travel', 'Foodie', 'Languages', 'Yoga', 'Live Music'],
                    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
                    viewCount: 188,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1004,
                    email: 'emma@example.com',
                    name: 'Emma',
                    age: 23,
                    bio: 'Fashion student with a passion for vintage clothing and indie music. Life\'s too short for boring conversations! Let\'s grab bubble tea and talk about our dreams. 🌟',
                    interests: ['Fashion', 'Indie Music', 'Thrifting', 'Art', 'Photography'],
                    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
                    viewCount: 567,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1005,
                    email: 'isabella@example.com',
                    name: 'Isabella',
                    age: 29,
                    bio: 'Yoga instructor and wellness coach. I believe in good vibes, green smoothies, and meaningful connections. Looking for someone who can match my energy!',
                    interests: ['Yoga', 'Meditation', 'Healthy Living', 'Nature', 'Spirituality'],
                    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
                    viewCount: 423,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1006,
                    email: 'olivia@example.com',
                    name: 'Olivia',
                    age: 35,
                    bio: 'Corporate lawyer who loves a good wine and deep conversation. I work hard and play harder. Looking for someone mature who knows what they want in life.',
                    interests: ['Wine', 'Fine Dining', 'Reading', 'Running', 'Jazz'],
                    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
                    viewCount: 289,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1007,
                    email: 'mia@example.com',
                    name: 'Mia',
                    age: 26,
                    bio: 'Graphic designer and plant mom. I spend my weekends at farmers markets and trying new restaurants. If you can make me laugh, you\'re already winning. 😊',
                    interests: ['Design', 'Plants', 'Foodie', 'Podcasts', 'Sustainability'],
                    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
                    viewCount: 612,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1008,
                    email: 'charlotte@example.com',
                    name: 'Charlotte',
                    age: 38,
                    bio: 'Successful entrepreneur and single mom. I\'ve learned that life is precious and I don\'t settle for less than I deserve. Seeking someone genuine, confident, and ready for something real.',
                    interests: ['Business', 'Travel', 'Fitness', 'Wine', 'Theater'],
                    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
                    viewCount: 195,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1009,
                    email: 'ava@example.com',
                    name: 'Ava',
                    age: 24,
                    bio: 'Psychology student and aspiring therapist. I love deep talks, stargazing, and finding hidden gems in the city. Bonus points if you have good taste in music!',
                    interests: ['Psychology', 'Music Festivals', 'Reading', 'Astrology', 'Coffee'],
                    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
                    viewCount: 741,
                    likes: [],
                    dislikes: [],
                    matches: [],
                },
                {
                    id: 1010,
                    email: 'victoria@example.com',
                    name: 'Victoria',
                    age: 42,
                    bio: 'Art curator and wine enthusiast. I\'ve lived in Paris, Rome, and now here. Life experience has taught me what matters. Looking for intelligent conversation and genuine chemistry.',
                    interests: ['Art', 'Wine', 'Culture', 'Travel', 'Fine Dining'],
                    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
                    viewCount: 156,
                    likes: [],
                    dislikes: [],
                    matches: [],
                }
            ];
            saveAllUsers(seedProfiles);
        }
    }, []);

    // Sync current user to global database whenever it changes
    useEffect(() => {
        if (currentUser) {
            const allUsers = getAllUsers();
            const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
            if (userIndex >= 0) {
                // Update existing user in global database
                const updatedUsers = [...allUsers];
                updatedUsers[userIndex] = currentUser;
                saveAllUsers(updatedUsers);
            }
        }
    }, [currentUser]);

    // Load swipe queue on login or when current user changes
    useEffect(() => {
        setIsLoading(true);
        if (currentUser) {
            const allUsers = getAllUsers();
            const unseenProfiles = allUsers.filter(p => 
                p.id !== currentUser.id &&
                !currentUser.likes.includes(p.id) &&
                !currentUser.dislikes.includes(p.id)
            );
            setSwipeQueue(unseenProfiles);
            setCurrentIndex(0);
            if (currentView === 'auth' || currentView === 'profileSetup') {
              setCurrentView('swiping');
            }
        } else {
            setCurrentView('auth');
        }
        setIsLoading(false);
    }, [currentUser]);

    // Global notification system - monitor all conversations for new messages
    const previousConversationLengths = useCallback((convId: string) => {
        const key = `ai-lign-prev-msg-count-${convId}`;
        const stored = sessionStorage.getItem(key);
        return stored ? parseInt(stored, 10) : 0;
    }, []);

    const setPreviousConversationLength = useCallback((convId: string, count: number) => {
        const key = `ai-lign-prev-msg-count-${convId}`;
        sessionStorage.setItem(key, count.toString());
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        Object.keys(conversations).forEach(conversationId => {
            const messages = conversations[conversationId];
            const currentCount = messages.length;
            const previousCount = previousConversationLengths(conversationId);

            // Check if there's a new message
            if (currentCount > previousCount && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                
                // Only notify for messages from matched users, not from the current user
                if (lastMessage.sender === 'matched') {
                    // Find the matched profile
                    const [id1, id2] = conversationId.split('-').map(Number);
                    const matchedId = id1 === currentUser.id ? id2 : id1;
                    
                    // Only show notification if not currently chatting with this person
                    if (!chattingWith || chattingWith.id !== matchedId) {
                        const allUsers = getAllUsers();
                        const matchedProfile = allUsers.find(u => u.id === matchedId);
                        
                        if (matchedProfile) {
                            showNotification(`${matchedProfile.name} sent you a message`, {
                                body: lastMessage.text?.substring(0, 60) + (lastMessage.text && lastMessage.text.length > 60 ? '...' : '') || '📷 Sent a photo',
                                icon: matchedProfile.imageUrl,
                                tag: `message-${conversationId}`, // Prevents duplicate notifications
                            });
                        }
                    }
                }
            }

            setPreviousConversationLength(conversationId, currentCount);
        });
    }, [conversations, currentUser, chattingWith, previousConversationLengths, setPreviousConversationLength]);
    
    const showNotification = (title: string, options: NotificationOptions) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, options);
        }
    };

    const handleLogin = (email: string): boolean => {
        const allUsers = getAllUsers();
        const user = allUsers.find(u => u.email === email);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };
    
    const handleSignup = (profileData: Omit<UserProfile, 'id' | 'likes' | 'dislikes' | 'matches'>): boolean => {
        const allUsers = getAllUsers();
        if (allUsers.some(u => u.email === profileData.email)) {
            return false; // Email already exists
        }
        const newUser: UserProfile = {
            ...profileData,
            id: Date.now(),
            likes: [],
            dislikes: [],
            matches: [],
        };
        try {
            saveAllUsers([...allUsers, newUser]);
            setCurrentUser(newUser);
            setCurrentView('swiping'); // Explicitly set the view here to avoid race conditions
            setToast({ show: true, message: 'Welcome! Your profile is live.' });
            return true;
        } catch (error) {
            // If storage fails, return false to show error in UI
            return false;
        }
    };
    
    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setCurrentUser(updatedProfile);
        const allUsers = getAllUsers();
        const updatedUsers = allUsers.map(u => u.id === updatedProfile.id ? updatedProfile : u);
        saveAllUsers(updatedUsers);
        setCurrentView('swiping');
        setToast({ show: true, message: 'Profile updated successfully.' });
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('auth');
    };

    const handleLike = () => {
        if (isMatching || !currentUser) return;

        const targetProfile = swipeQueue[currentIndex];
        if (!targetProfile) return;

        // Update current user's likes
        const updatedCurrentUser = { ...currentUser, likes: [...currentUser.likes, targetProfile.id] };
        
        // Check if the target profile already likes us back
        const alreadyLikesBack = targetProfile.likes.includes(currentUser.id);
        
        // Auto-match: If target profile is a seed profile (ID < 10000), have them like us back
        const shouldAutoMatch = targetProfile.id < 10000 && !alreadyLikesBack;
        
        if (alreadyLikesBack || shouldAutoMatch) {
            // IT'S A MATCH!
            const updatedTargetProfile = shouldAutoMatch 
                ? { ...targetProfile, likes: [...targetProfile.likes, currentUser.id] }
                : targetProfile;
            
            const matchTimestamp = new Date().toISOString();
            const finalCurrentUser = { 
                ...updatedCurrentUser, 
                matches: [...updatedCurrentUser.matches, targetProfile.id],
                matchTimestamps: {
                    ...(updatedCurrentUser.matchTimestamps || {}),
                    [targetProfile.id]: matchTimestamp
                }
            };
            const finalTargetProfile = { 
                ...updatedTargetProfile, 
                matches: [...updatedTargetProfile.matches, currentUser.id],
                matchTimestamps: {
                    ...(updatedTargetProfile.matchTimestamps || {}),
                    [currentUser.id]: matchTimestamp
                }
            };
            
            setCurrentUser(finalCurrentUser);
            setMatchedProfile(finalTargetProfile);

            // Update global database
            const allUsers = getAllUsers();
            const updatedUsers = allUsers.map(u => {
                if (u.id === finalCurrentUser.id) return finalCurrentUser;
                if (u.id === finalTargetProfile.id) return finalTargetProfile;
                return u;
            });
            saveAllUsers(updatedUsers);
            
            setIsMatching(true);
            setTimeout(() => {
                setIsMatching(false);
                setShowMatchModal(true);
            }, 2500);

        } else {
            // No match yet, just record the like
            setCurrentUser(updatedCurrentUser);
            const allUsers = getAllUsers();
            const updatedUsers = allUsers.map(u => u.id === updatedCurrentUser.id ? updatedCurrentUser : u);
            saveAllUsers(updatedUsers);
            goToNextProfile();
        }
    };
    
     const handlePass = () => {
        if (isMatching || !currentUser) return;
        const targetProfile = swipeQueue[currentIndex];
        if (!targetProfile) return;

        const updatedCurrentUser = { ...currentUser, dislikes: [...currentUser.dislikes, targetProfile.id] };
        setCurrentUser(updatedCurrentUser);
        
        const allUsers = getAllUsers();
        const updatedUsers = allUsers.map(u => u.id === updatedCurrentUser.id ? updatedCurrentUser : u);
        saveAllUsers(updatedUsers);
        
        goToNextProfile();
    };

    const goToNextProfile = () => {
        setCurrentIndex(prev => prev + 1);
    };
    
    const handleBlock = (profileToBlock: UserProfile) => {
        if (!currentUser) return;

        // Add to dislikes to prevent seeing them again, and remove from matches/likes
        const updatedCurrentUser = {
            ...currentUser,
            dislikes: [...currentUser.dislikes, profileToBlock.id],
            likes: currentUser.likes.filter(id => id !== profileToBlock.id),
            matches: currentUser.matches.filter(id => id !== profileToBlock.id),
        };
        setCurrentUser(updatedCurrentUser);

        const allUsers = getAllUsers();
        saveAllUsers(allUsers.map(u => u.id === updatedCurrentUser.id ? updatedCurrentUser : u));

        if (currentView === 'chat') {
            setCurrentView('matches');
            setChattingWith(null);
        }

        setToast({ show: true, message: `${profileToBlock.name} has been blocked.` });
        setShowConfirmModal({...showConfirmModal, isOpen: false});
    };

    const handleStartConversation = (profile: UserProfile, openingLine?: string) => {
        setChattingWith(profile);
        setCurrentView('chat');
        setShowMatchModal(false);
        setShowPickupLineModal(false);

        if (openingLine && currentUser) {
            const conversationId = [currentUser.id, profile.id].sort().join('-');
            const userMessage: Message = {
                id: Date.now(),
                text: openingLine,
                sender: 'user', // In this context, 'user' is the currentUser
                senderId: currentUser.id, // Store who actually sent this message
                timestamp: new Date(),
                read: true,
            };
            setConversations(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), userMessage]
            }));
        }
    };

    const handleUpdateConversation = (matchedProfileId: number, updateFn: (prevMessages: Message[]) => Message[]) => {
        if (!currentUser) return;
        const conversationId = [currentUser.id, matchedProfileId].sort().join('-');
        setConversations(prev => ({
            ...prev,
            [conversationId]: updateFn(prev[conversationId] || [])
        }));
    };
    
    const currentProfileForSwiping = swipeQueue[currentIndex];

    // MAIN RENDER LOGIC
    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (!currentUser) {
        if (currentView === 'profileSetup') {
            return <ProfileSetup onProfileCreate={handleSignup} />;
        }
        return <AuthView onLogin={handleLogin} onShowSignup={() => setCurrentView('profileSetup')} />;
    }
    
    switch(currentView) {
        case 'editProfile':
            return <EditProfile 
                userProfile={currentUser} 
                onProfileUpdate={handleProfileUpdate}
                onCancel={() => setCurrentView('swiping')}
                onLogout={handleLogout}
            />;
        case 'chat':
            if (chattingWith) {
                const conversationId = [currentUser.id, chattingWith.id].sort().join('-');
                const chatMessages = conversations[conversationId] || [];
                
                return <ChatView 
                    userProfile={currentUser}
                    matchedProfile={chattingWith}
                    messages={chatMessages}
                    onUpdateConversation={handleUpdateConversation}
                    onGoBack={() => { setCurrentView('matches'); setChattingWith(null); }}
                    onBlock={(profile) => setShowConfirmModal({isOpen: true, onConfirm: () => handleBlock(profile), title: `Block ${profile.name}?`, message: 'You will not see their profile or messages again. This is permanent.', confirmText: "Block"})}
                    showNotification={showNotification}
                    onInitiateVideoChat={() => setCurrentView('videoChat')}
                />;
            }
            // If no chattingWith profile, go back to matches
            console.warn('Chat view opened with no profile selected');
            setCurrentView('matches');
            return null;
        case 'videoChat':
            if (chattingWith) {
                return <VideoChatView 
                    userProfile={currentUser}
                    matchedProfile={chattingWith}
                    onEndCall={() => setCurrentView('chat')}
                />
            }
            setCurrentView('chat');
            return null;
        case 'groupChat':
            return <AnonymousGroupChat 
                onLeave={() => setCurrentView('swiping')}
            />;
        case 'matches':
            const allUsers = getAllUsers();
            const matchProfiles = allUsers.filter(u => currentUser.matches.includes(u.id));
            
            // Sort matches by timestamp (newest first)
            const sortedMatches = matchProfiles.sort((a, b) => {
                const timestampA = currentUser.matchTimestamps?.[a.id] || '';
                const timestampB = currentUser.matchTimestamps?.[b.id] || '';
                return timestampB.localeCompare(timestampA); // Descending order (newest first)
            });

            return <CompatibleModels 
                matches={sortedMatches}
                onStartConversation={handleStartConversation}
                onGoBack={() => setCurrentView('swiping')}
                onBlock={(profile) => setShowConfirmModal({isOpen: true, onConfirm: () => handleBlock(profile), title: `Block ${profile.name}?`, message: 'You will not see their profile or messages again. This is permanent.', confirmText: "Block"})}
                onEditProfile={() => setCurrentView('editProfile')}
                conversations={conversations}
                currentUserId={currentUser.id}
            />
        case 'swiping':
        default:
             return (
                <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
                    
                    <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
                        <Header 
                            onShowModelsClick={() => setCurrentView('matches')} 
                            showModelsButton 
                            onDarkRoomClick={() => setCurrentView('groupChat')}
                            showDarkRoomButton
                        />
                        <main className="flex-grow flex flex-col items-center justify-center relative">
                            <div className="w-full max-w-sm h-[70vh] max-h-[600px] relative">
                                {currentProfileForSwiping ? (
                                    <ProfileCard 
                                        profile={currentProfileForSwiping} 
                                        userProfile={currentUser} 
                                        onBlock={(profile) => setShowConfirmModal({isOpen: true, onConfirm: () => handleBlock(profile), title: `Block ${profile.name}?`, message: 'You will not see their profile or messages again. This is permanent.', confirmText: "Block"})}
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 font-mono"><p>There's no one new around you right now.</p></div>
                                )}
                                {isMatching && <MatchAnimation />}
                            </div>

                            <footer className="flex items-center justify-center gap-8 md:gap-16 mt-8">
                                <ActionButton variant="reject" onClick={handlePass} disabled={isMatching || !currentProfileForSwiping}>
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </ActionButton>
                                
                                <button onClick={() => setShowPickupLineModal(true)} disabled={isMatching || !currentProfileForSwiping} className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </button>

                                <ActionButton variant="accept" onClick={handleLike} disabled={isMatching || !currentProfileForSwiping}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                                </ActionButton>
                            </footer>
                        </main>
                    </div>
                    {/* Modals and Toasts */}
                    <MatchModal 
                        isOpen={showMatchModal}
                        onClose={() => { setShowMatchModal(false); goToNextProfile(); }}
                        onStartConversation={() => handleStartConversation(matchedProfile!)}
                        currentUserProfile={currentUser}
                        matchedProfile={matchedProfile}
                    />
                    <PickupLineModal 
                        isOpen={showPickupLineModal}
                        onClose={() => setShowPickupLineModal(false)}
                        onSubmit={(line) => { handleLike(); handleStartConversation(currentProfileForSwiping, line); }}
                        profile={currentProfileForSwiping}
                    />
                    <ConfirmationModal 
                        isOpen={showConfirmModal.isOpen}
                        onClose={() => setShowConfirmModal({...showConfirmModal, isOpen: false})}
                        onConfirm={showConfirmModal.onConfirm}
                        title={showConfirmModal.title}
                        message={showConfirmModal.message}
                        confirmText={showConfirmModal.confirmText}
                    />
                    <Toast 
                        show={toast.show}
                        message={toast.message}
                        onClose={() => setToast({ show: false, message: '' })}
                    />
                </div>
            );
    }
};

export default App;