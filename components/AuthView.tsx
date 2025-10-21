import React, { useState } from 'react';
import Header from './Header';

interface AuthViewProps {
    onLogin: (email: string) => boolean;
    onShowSignup: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onShowSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginAttempt = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError("Please enter your email.");
            return;
        }
        const success = onLogin(email);
        if (!success) {
            setError("No profile found with that email. Maybe you should sign up?");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col justify-center items-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/70"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZHRoPSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMCAzMiBMMzIgMCBNMzIgMzIgTDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU5LDAuMDUpIj48L3BhdGg+PC9zdmc+')] opacity-50"></div>

            <div className="relative z-10 text-center animate-fade-in-up w-full max-w-md">
                <Header />
                <div className="mt-12">
                    <p className="text-lg text-cyan-200/90 leading-relaxed">
                        Welcome to the new frequency of dating. Find someone who truly gets you.
                    </p>
                </div>
                <form onSubmit={handleLoginAttempt} className="mt-8 space-y-4 text-left">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Password (anything you want)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    />
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full font-bold text-lg py-3 px-10 rounded-lg transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-xl hover:shadow-cyan-500/40"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-6">
                     <p className="text-gray-400">
                        New here?{' '}
                        <button onClick={onShowSignup} className="font-semibold text-fuchsia-400 hover:underline">
                            Create your profile.
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
