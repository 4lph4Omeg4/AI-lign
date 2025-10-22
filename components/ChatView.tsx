import React, { useState, useEffect, useRef, memo } from 'react';
import { UserProfile, Message } from '../types';
import { generateChatResponse } from '../services/geminiService';

interface ChatViewProps {
    userProfile: UserProfile;
    matchedProfile: UserProfile;
    messages: Message[];
    onUpdateConversation: (profileId: number, updateFn: (prevMessages: Message[]) => Message[]) => void;
    onGoBack: () => void;
    onBlock: (profile: UserProfile) => void;
    showNotification: (title: string, options: NotificationOptions) => void;
    onInitiateVideoChat: () => void;
}

const ReadReceiptIcon: React.FC<{ isRead: boolean }> = memo(({ isRead }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ml-1 inline-block transition-colors duration-500 ${isRead ? 'text-cyan-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-9 13.5" transform="translate(-5)" opacity="0.7" />
    </svg>
));

ReadReceiptIcon.displayName = 'ReadReceiptIcon';

// Message bubble component - extracted and memoized to prevent flickering
interface MessageBubbleProps {
    message: Message;
    matchedProfileName: string;
    isCurrentlyViewing: boolean;
    onStartViewing: (id: number) => void;
    onEndViewing: (id: number) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, matchedProfileName, isCurrentlyViewing, onStartViewing, onEndViewing }) => {
    const isUser = message.sender === 'user';
    const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const bubbleClasses = isUser
        ? "bg-gradient-to-br from-blue-500 to-blue-700 self-end ml-auto"
        : "bg-gradient-to-br from-purple-600 to-fuchsia-600 self-start mr-auto";
    const alignmentClasses = isUser ? "items-end ml-auto" : "items-start mr-auto";
    const senderName = isUser ? 'You' : matchedProfileName;
    const senderColor = isUser ? "text-blue-300" : "text-fuchsia-300";

    if (message.ephemeral) {
        if (message.viewed) {
            return (
                <div className="text-center text-xs text-gray-500 font-mono my-2 animate-fade-in self-center px-4 py-1 bg-gray-800/50 rounded-full">
                    Photo viewed and deleted.
                </div>
            );
        }
        return (
            <div className={`flex flex-col w-full max-w-[80%] mx-2 ${alignmentClasses} animate-fade-in-up`}>
                <div className={`px-2 py-0.5 rounded-t-lg ${isUser ? 'bg-blue-500/30' : 'bg-purple-500/30'} backdrop-blur-sm mb-1`}>
                    <span className={`text-xs font-bold ${senderColor}`}>
                        {senderName}
                    </span>
                </div>
                <div
                    onMouseDown={() => onStartViewing(message.id)}
                    onMouseUp={() => onEndViewing(message.id)}
                    onMouseLeave={() => { if (isCurrentlyViewing) onEndViewing(message.id); }}
                    onTouchStart={() => onStartViewing(message.id)}
                    onTouchEnd={() => onEndViewing(message.id)}
                    onTouchCancel={() => { if (isCurrentlyViewing) onEndViewing(message.id); }}
                    className={`px-4 py-3 rounded-2xl ${bubbleClasses} cursor-pointer`}
                >
                    <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5l-6 6m0 0l-6-6m6 6l6-6m-6 6V4.5m6 6v-6" transform="rotate(45 12 12)" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3.34 3.34 0 00-4.58 2.52 3.34 3.34 0 007.16 0A3.34 3.34 0 0012 9z" opacity={0.4}/>
                        </svg>
                        <span className="font-bold">Hold to View Photo</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col w-full max-w-[80%] mx-2 ${alignmentClasses} animate-fade-in-up`}>
            {/* Sender Name Badge */}
            <div className={`px-2 py-0.5 rounded-t-lg ${isUser ? 'bg-blue-500/30' : 'bg-purple-500/30'} backdrop-blur-sm mb-1 inline-block self-start`}>
                <span className={`text-xs font-bold ${senderColor}`}>
                    {senderName}
                </span>
            </div>
            
            {/* Message Content */}
            <div className={`px-4 py-3 rounded-2xl ${bubbleClasses} ${message.imageUrl ? 'p-2' : ''} shadow-lg`}>
                {message.imageUrl && (
                    <img src={message.imageUrl} alt="Shared content" className="max-w-xs max-h-80 object-cover rounded-xl mb-2" />
                )}
                {message.text && (
                    <p className="text-white text-base leading-relaxed break-words">{message.text}</p>
                )}
            </div>
            
            {/* Timestamp and Read Receipt */}
            <div className={`flex items-center mt-1 px-2 gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs text-gray-500 font-medium">{formattedTime}</span>
                {isUser && message.read !== undefined && <ReadReceiptIcon isRead={message.read} />}
            </div>
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

const ChatView: React.FC<ChatViewProps> = ({ userProfile, matchedProfile, messages, onUpdateConversation, onGoBack, onBlock, showNotification, onInitiateVideoChat }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [imageToSend, setImageToSend] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isEphemeral, setIsEphemeral] = useState(false);
    const [ephemeralInView, setEphemeralInView] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate unique message IDs that won't conflict even across sessions
    const getUniqueMessageId = () => Date.now() + Math.random();
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]); // Only re-run when message count changes

    // Mark messages as read when first entering the chat or when new unread messages arrive
    useEffect(() => {
        const unreadMessages = messages.filter(msg => msg.sender === 'matched' && !msg.read);
        if (unreadMessages.length > 0) {
            // Use setTimeout to avoid update during render
            const timer = setTimeout(() => {
                onUpdateConversation(matchedProfile.id, prevMessages =>
                    prevMessages.map(msg => 
                        msg.sender === 'matched' && !msg.read ? { ...msg, read: true } : msg
                    )
                );
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages.length, matchedProfile.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleSendMessage = async (text: string, imageUrl?: string, ephemeral?: boolean) => {
        if (!text && !imageUrl) return; // Don't send empty messages
        
        const message: Message = {
            id: getUniqueMessageId(),
            text: text || undefined,
            imageUrl,
            sender: 'user', // In this simulation, the current user is always the sender
            timestamp: new Date(),
            read: true, // For simplicity, messages are marked as read immediately
            ephemeral,
            viewed: false,
        };

        // Update conversation immediately
        onUpdateConversation(matchedProfile.id, prev => [...prev, message]);

        // Generate AI response (only if seed profile with ID < 10000)
        if (matchedProfile.id < 10000 && text && !ephemeral) {
            setIsTyping(true);
            
            // Realistic typing delay (1-3 seconds)
            const typingDelay = 1000 + Math.random() * 2000;
            
            setTimeout(async () => {
                try {
                    // Generate AI response with the user's message included
                    const conversationForAI = [...messages, message];
                    const aiResponse = await generateChatResponse(matchedProfile, conversationForAI, text);
                    
                    const aiMessage: Message = {
                        id: getUniqueMessageId(),
                        text: aiResponse,
                        sender: 'matched',
                        timestamp: new Date(),
                        read: false,
                    };
                    
                    // Add AI response to conversation
                    onUpdateConversation(matchedProfile.id, prev => [...prev, aiMessage]);
                    
                    setIsTyping(false);
                    
                    // Show notification
                    showNotification(`${matchedProfile.name} replied`, {
                        body: aiResponse.substring(0, 50) + (aiResponse.length > 50 ? '...' : ''),
                        icon: matchedProfile.imageUrl,
                    });
                } catch (error) {
                    console.error('Error generating AI response:', error);
                    setIsTyping(false);
                }
            }, typingDelay);
        }
    };

    const handleTextInputSend = () => {
        if (newMessage.trim()) {
            handleSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };
    
    const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageToSend(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
        if (event.target) event.target.value = '';
    };

    const closeImageConfirmModal = () => {
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImageToSend(null);
        setImagePreviewUrl(null);
        setIsEphemeral(false);
    };

    const handleConfirmImageSend = async () => {
        if (!imageToSend) return;
        const imageUrl = URL.createObjectURL(imageToSend);
        handleSendMessage('', imageUrl, isEphemeral);
        closeImageConfirmModal();
    };

    const handleEphemeralViewEnd = (messageId: number) => {
        if (ephemeralInView !== messageId) return;
        setEphemeralInView(null);
        onUpdateConversation(matchedProfile.id, prev =>
            prev.map(msg => msg.id === messageId ? { ...msg, viewed: true } : msg)
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTextInputSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
            {ephemeralInView && (
                 <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                    <img src={messages.find(m => m.id === ephemeralInView)?.imageUrl} alt="Ephemeral content" className="max-w-full max-h-full object-contain" />
                </div>
            )}

            {imageToSend && imagePreviewUrl && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={closeImageConfirmModal}>
                    <div className="bg-gray-900 rounded-2xl p-6 text-center max-w-sm w-11/12" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-cyan-300">Send Photo</h2>
                        <img src={imagePreviewUrl} alt="Preview" className="my-4 rounded-lg max-h-64 mx-auto" />
                        <label className="flex items-center justify-center gap-3 font-mono text-lg cursor-pointer group" htmlFor="ephemeral-toggle">
                             <div className={`relative w-12 h-7 rounded-full transition-colors ${isEphemeral ? 'bg-fuchsia-600' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isEphemeral ? 'translate-x-5' : ''}`}></div>
                            </div>
                            <span className={`transition-colors ${isEphemeral ? 'text-fuchsia-400' : 'text-gray-400'}`}>
                                View Once
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">{isEphemeral ? "The photo will be deleted after being viewed." : "The photo will be saved in the chat."}</p>
                        <div className="mt-6 flex gap-4">
                            <button onClick={closeImageConfirmModal} className="w-full bg-gray-700/50 hover:bg-gray-700 font-bold py-3 px-4 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleConfirmImageSend} className="w-full font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-cyan-500/50">Send</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>

            <div className="relative z-10 flex flex-col h-screen animate-fade-in">
                {/* Header */}
                <header className="flex-shrink-0 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center">
                        <button onClick={onGoBack} className="text-cyan-300 hover:text-cyan-100 transition-colors p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex items-center ml-4">
                            <img src={matchedProfile.imageUrl} alt={matchedProfile.name} className="w-10 h-10 rounded-full object-cover border-2 border-fuchsia-500" />
                            <div className="ml-3">
                                <h2 className="font-bold text-lg leading-tight">{matchedProfile.name}</h2>
                                <p className="text-xs text-green-400 font-mono">
                                    {isTyping ? 'typing...' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                         <button onClick={onInitiateVideoChat} title="Video Call" className="p-2 rounded-full text-cyan-400 hover:bg-cyan-400/20 hover:text-cyan-200 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setShowMenu(prev => !prev)} title="More options" className="p-2 rounded-full text-gray-400 hover:bg-gray-400/20 hover:text-gray-200 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-white/10 rounded-md shadow-lg z-20 animate-fade-in">
                                    <button onClick={() => { onBlock(matchedProfile); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors">Block {matchedProfile.name}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* Chat Body */}
                <main className="flex-grow p-4 md:p-8 flex flex-col overflow-y-auto no-scrollbar">
                   {messages.length === 0 && !isTyping && (
                        <div className="text-center text-sm text-gray-500 font-mono m-auto">
                            <p>You matched with {matchedProfile.name}.</p>
                            <p className="mt-1 text-cyan-400/80">Make the first move!</p>
                        </div>
                    )}
                    <div className="flex flex-col space-y-4">
                        {messages.map(msg => (
                            <MessageBubble 
                                key={msg.id} 
                                message={msg} 
                                matchedProfileName={matchedProfile.name}
                                isCurrentlyViewing={ephemeralInView === msg.id}
                                onStartViewing={setEphemeralInView}
                                onEndViewing={handleEphemeralViewEnd}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex flex-col w-full max-w-md mx-2 items-start animate-fade-in-up">
                                <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 px-1">{matchedProfile.name} is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </main>
                {/* Input Footer */}
                <footer className="flex-shrink-0 bg-gray-900/50 backdrop-blur-lg border-t border-white/10 p-4">
                    <div className="flex items-center bg-gray-800/70 rounded-lg pl-2 pr-4 py-2 border border-cyan-400/30 focus-within:ring-2 focus-within:ring-cyan-400 transition-all">
                        <input type="file" ref={fileInputRef} onChange={handleImageInputChange} accept="image/*" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-cyan-300 transition-colors" title="Send Photo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" /></svg>
                        </button>
                        <input type="text" placeholder="Send a message..." className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none ml-2" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown}/>
                        <button onClick={handleTextInputSend} className="ml-4 text-cyan-300 disabled:opacity-50 hover:text-cyan-100 transition-colors" disabled={!newMessage.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatView;
