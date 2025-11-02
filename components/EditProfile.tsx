import React, { useState } from 'react';
import { UserProfile } from '../types';
import Header from './Header';

interface EditProfileProps {
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    onCancel: () => void;
    onLogout: () => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
     <textarea {...props} className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none no-scrollbar" />
);

const InterestChip: React.FC<{ text: string, onRemove: () => void }> = ({ text, onRemove }) => (
    <span className="flex items-center bg-cyan-400/20 text-cyan-300 text-sm font-mono pl-3 pr-2 py-1 rounded-full animate-fade-in">
        {text}
        <button onClick={onRemove} className="ml-2 text-cyan-300/50 hover:text-cyan-300">&times;</button>
    </span>
);


const EditProfile: React.FC<EditProfileProps> = ({ userProfile, onProfileUpdate, onCancel, onLogout }) => {
    const [name, setName] = useState(userProfile.name);
    const [age, setAge] = useState(String(userProfile.age));
    const [bio, setBio] = useState(userProfile.bio);
    const [interests, setInterests] = useState<string[]>(userProfile.interests);
    const [currentInterest, setCurrentInterest] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(userProfile.imageUrl);
    const [privatePhotos, setPrivatePhotos] = useState<string[]>(userProfile.privatePhotos || []);
    const [lookingFor, setLookingFor] = useState<'fun' | 'webcam' | 'connection' | 'hookup' | undefined>(userProfile.lookingFor);
    const [gender, setGender] = useState<'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say' | undefined>(userProfile.gender);

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Resize to max 400x400 while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 400;
                    
                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                setImagePreview(compressedImage);
            } catch (error) {
                console.error('Error compressing image:', error);
                alert('Failed to process image. Please try another.');
            }
        }
    };

    const handlePrivatePhotoAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                setPrivatePhotos([...privatePhotos, compressedImage]);
            } catch (error) {
                console.error('Error compressing image:', error);
                alert('Failed to process image. Please try another.');
            }
        }
        if (e.target) e.target.value = '';
    };

    const removePrivatePhoto = (indexToRemove: number) => {
        setPrivatePhotos(privatePhotos.filter((_, index) => index !== indexToRemove));
    };

    const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentInterest.trim() !== '') {
            e.preventDefault();
            if (!interests.includes(currentInterest.trim())) {
                setInterests([...interests, currentInterest.trim()]);
            }
            setCurrentInterest('');
        }
    };
    
    const removeInterest = (indexToRemove: number) => {
        setInterests(interests.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age || !bio || interests.length === 0 || !imagePreview) {
            alert("All fields must be filled.");
            return;
        }
        onProfileUpdate({
            ...userProfile,
            name,
            age: parseInt(age, 10),
            bio,
            interests,
            imageUrl: imagePreview,
            privatePhotos,
            lookingFor,
            gender,
        });
    };
    
    const isFormValid = name && age && bio && interests.length > 0 && imagePreview;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 min-h-screen p-4 md:p-8">
                <Header />
                <main className="flex items-center justify-center animate-fade-in-up py-8">
                    <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-center text-cyan-300">Edit Your Profile</h2>
                        
                        {/* Top section: Profile photo, name, age in a row */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <label htmlFor="photo-upload" className="cursor-pointer group">
                                    <div className="w-32 h-32 rounded-full bg-gray-900/50 border-2 border-dashed border-gray-600 flex items-center justify-center text-center text-gray-500 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover"/>
                                        ) : "Upload Photo"}
                                    </div>
                                </label>
                                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                            <div className="flex-grow space-y-4">
                               <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                               <Input placeholder="Age" type="number" value={age} onChange={e => setAge(e.target.value)} required />
                            </div>
                        </div>
                        
                        {/* Two column layout for bio, interests, and private photos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column: Bio and Interests */}
                            <div className="space-y-6">
                                <div>
                                   <Textarea placeholder="About you..." value={bio} onChange={e => setBio(e.target.value)} rows={4} required />
                                </div>
                                <div>
                                     <Input 
                                        placeholder="Add an interest and press Enter" 
                                        value={currentInterest}
                                        onChange={e => setCurrentInterest(e.target.value)}
                                        onKeyDown={handleAddInterest}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {interests.map((interest, index) => (
                                            <InterestChip key={index} text={interest} onRemove={() => removeInterest(index)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right column: Gender, Looking For & Private Photos */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-blue-400 mb-3">Gender</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setGender('male')}
                                            className={`p-3 rounded-lg border-2 transition-all ${gender === 'male' ? 'border-blue-400 bg-blue-400/20' : 'border-white/20 hover:border-blue-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">👨</div>
                                            <div className="text-xs font-semibold">Male</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender('female')}
                                            className={`p-3 rounded-lg border-2 transition-all ${gender === 'female' ? 'border-pink-400 bg-pink-400/20' : 'border-white/20 hover:border-pink-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">👩</div>
                                            <div className="text-xs font-semibold">Female</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender('non-binary')}
                                            className={`p-3 rounded-lg border-2 transition-all ${gender === 'non-binary' ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-yellow-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">⚧️</div>
                                            <div className="text-xs font-semibold">Non-Binary</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender('prefer-not-to-say')}
                                            className={`p-3 rounded-lg border-2 transition-all ${gender === 'prefer-not-to-say' ? 'border-gray-400 bg-gray-400/20' : 'border-white/20 hover:border-gray-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">🤐</div>
                                            <div className="text-xs font-semibold">Prefer not to say</div>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-3">What I'm Looking For</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setLookingFor('fun')}
                                            className={`p-3 rounded-lg border-2 transition-all ${lookingFor === 'fun' ? 'border-cyan-400 bg-cyan-400/20' : 'border-white/20 hover:border-cyan-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">😊</div>
                                            <div className="text-xs font-semibold">Fun Chat</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLookingFor('webcam')}
                                            className={`p-3 rounded-lg border-2 transition-all ${lookingFor === 'webcam' ? 'border-fuchsia-400 bg-fuchsia-400/20' : 'border-white/20 hover:border-fuchsia-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">🔥</div>
                                            <div className="text-xs font-semibold">Webcam</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLookingFor('connection')}
                                            className={`p-3 rounded-lg border-2 transition-all ${lookingFor === 'connection' ? 'border-purple-400 bg-purple-400/20' : 'border-white/20 hover:border-purple-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">💝</div>
                                            <div className="text-xs font-semibold">Connection</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLookingFor('hookup')}
                                            className={`p-3 rounded-lg border-2 transition-all ${lookingFor === 'hookup' ? 'border-red-400 bg-red-400/20' : 'border-white/20 hover:border-red-400/50'}`}
                                        >
                                            <div className="text-2xl mb-1">🔥💋</div>
                                            <div className="text-xs font-semibold">Hook Up</div>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-fuchsia-400 mb-3">🔒 Private Photos</h3>
                                    <p className="text-xs text-gray-400 mb-3">Add photos that others can request to view</p>
                                <label htmlFor="private-photo-upload" className="cursor-pointer">
                                    <div className="w-full bg-gray-900/50 border-2 border-dashed border-fuchsia-400/30 rounded-lg px-4 py-3 text-center text-gray-400 hover:border-fuchsia-400/50 hover:text-fuchsia-400 transition-colors">
                                        + Add Private Photo
                                    </div>
                                </label>
                                <input id="private-photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePrivatePhotoAdd} />
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    {privatePhotos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <img src={photo} alt={`Private ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-fuchsia-400/30" />
                                            <button
                                                type="button"
                                                onClick={() => removePrivatePhoto(index)}
                                                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                             <button 
                                type="button" 
                                onClick={onCancel}
                                className="w-full bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={!isFormValid}
                                className="w-full font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50"
                            >
                               Save Changes
                            </button>
                        </div>
                        <div className="pt-4 text-center border-t border-white/10 space-y-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Reset all users? This will clear all profiles and reload seed profiles. Your current profile will be kept.')) {
                                        window.localStorage.removeItem('ai-lign-all-users');
                                        window.localStorage.removeItem('ai-lign-conversations');
                                        alert('Database reset! Please refresh the page.');
                                        window.location.reload();
                                    }
                                }}
                                className="block w-full text-sm text-yellow-400/70 hover:text-yellow-400 hover:underline font-mono transition-colors"
                            >
                                🔄 Reset Database (Dev)
                            </button>
                            <button
                                type="button"
                                onClick={onLogout}
                                className="block w-full text-sm text-red-400/70 hover:text-red-400 hover:underline font-mono transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default EditProfile;
