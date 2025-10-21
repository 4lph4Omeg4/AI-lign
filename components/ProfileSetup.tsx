
import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile } from '../types';
import Header from './Header';

interface ProfileSetupProps {
    onProfileCreate: (profile: Omit<UserProfile, 'id' | 'likes' | 'dislikes' | 'matches'>) => boolean;
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

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileCreate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [interests, setInterests] = useState<string[]>(['Deep Conversations']);
    const [currentInterest, setCurrentInterest] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = useCallback(() => {
        const newErrors: { [key: string]: string } = {};
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "A valid email is required.";
        if (!password.trim() || password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (!name.trim()) newErrors.name = "Your name is required.";
        if (!age) {
            newErrors.age = "Your age is required.";
        } else if (isNaN(parseInt(age, 10)) || parseInt(age, 10) < 18) {
            newErrors.age = "You must be at least 18.";
        }
        if (!bio.trim()) newErrors.bio = "A bio is required.";
        if (bio.trim().length < 20) newErrors.bio = "Bio must be at least 20 characters.";
        if (interests.length === 0) newErrors.interests = "Add at least one interest.";
        if (!imagePreview) newErrors.image = "A profile picture is required.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [email, password, name, age, bio, interests.length, imagePreview]);

    useEffect(() => {
        if (isSubmitting) {
            validate();
        }
    }, [email, password, name, age, bio, interests, imagePreview, isSubmitting, validate]);

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
                setErrors(prev => ({...prev, image: ''}))
            } catch (error) {
                console.error('Error compressing image:', error);
                setErrors(prev => ({...prev, image: 'Failed to process image. Please try another.'}))
            }
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
        setIsSubmitting(true);
        if (validate()) {
            const success = onProfileCreate({
                email,
                name,
                age: parseInt(age, 10),
                bio,
                interests,
                imageUrl: imagePreview!,
                viewCount: 0,
            });
            if (!success) {
                // Could be duplicate email or storage quota error
                setErrors(prev => ({ 
                    ...prev, 
                    email: "This email address is already registered or storage limit reached. Try a smaller image." 
                }));
                setIsSubmitting(false);
            } else {
                // Reset submitting state even on success to ensure clean state
                setIsSubmitting(false);
            }
        } else {
             setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>
            
            <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
                <Header />
                <main className="flex-grow flex items-center justify-center animate-fade-in-up">
                    <form onSubmit={handleSubmit} noValidate className="w-full max-w-lg bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-center text-cyan-300">Create Your Profile</h2>
                        
                        <div>
                           <Input placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                           {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                       </div>
                       <div>
                           <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                           {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                       </div>

                        <div className="flex flex-col md:flex-row gap-6 pt-4">
                            <div className="flex-shrink-0 text-center">
                                <label htmlFor="photo-upload" className="cursor-pointer group">
                                    <div className={`w-32 h-32 mx-auto rounded-full bg-gray-900/50 border-2 border-dashed  flex items-center justify-center text-center text-gray-500 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-colors ${errors.image ? 'border-red-500/80' : 'border-gray-600'}`}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover"/>
                                        ) : "Upload Photo"}
                                    </div>
                                </label>
                                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                {errors.image && <p className="text-red-400 text-xs mt-2">{errors.image}</p>}
                            </div>
                            <div className="flex-grow space-y-4">
                               <div>
                                   <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                                   {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                               </div>
                               <div>
                                   <Input placeholder="Age" type="number" value={age} onChange={e => setAge(e.target.value)} required />
                                   {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                               </div>
                            </div>
                        </div>
                        <div>
                           <Textarea placeholder="About you... What makes you interesting?" value={bio} onChange={e => setBio(e.target.value)} rows={3} required />
                           {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
                        </div>
                        <div>
                             <Input 
                                placeholder="Add an interest and press Enter" 
                                value={currentInterest}
                                onChange={e => setCurrentInterest(e.target.value)}
                                onKeyDown={handleAddInterest}
                            />
                            <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                                {interests.map((interest, index) => (
                                    <InterestChip key={index} text={interest} onRemove={() => removeInterest(index)} />
                                ))}
                            </div>
                             {errors.interests && <p className="text-red-400 text-xs mt-1">{errors.interests}</p>}
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full font-bold py-3 px-4 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white disabled:opacity-70 disabled:cursor-wait hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center"
                        >
                           {isSubmitting ? 'Creating Profile...' : 'Get Started'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default ProfileSetup;
