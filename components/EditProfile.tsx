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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
        });
    };
    
    const isFormValid = name && age && bio && interests.length > 0 && imagePreview;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
                <Header />
                <main className="flex-grow flex items-center justify-center animate-fade-in-up">
                    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-center text-cyan-300">Edit Your Profile</h2>
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
                        <div>
                           <Textarea placeholder="About you..." value={bio} onChange={e => setBio(e.target.value)} rows={3} required />
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
                        <div className="flex gap-4">
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
                        <div className="pt-4 text-center border-t border-white/10">
                            <button
                                type="button"
                                onClick={onLogout}
                                className="text-sm text-red-400/70 hover:text-red-400 hover:underline font-mono transition-colors"
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
