import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, signup } = useApp();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  // Form states
  const [email, setEmail] = useState<string>('alex.rivera@highschool.edu');
  const [password, setPassword] = useState<string>('password123');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<'Grade 9' | 'Grade 10'>('Grade 10');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isLoginMode) {
      // Login
      const studentName = email.includes('alex') ? 'Alex Rivera' : email.split('@')[0];
      login(email, studentName);
    } else {
      // Sign Up
      if (!name) {
        setErrorMessage('Please enter your full student name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please recheck.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      signup(name, email, grade);
    }
  };

  const handleDemoLogin = (demoGrade: 'Grade 9' | 'Grade 10') => {
    if (demoGrade === 'Grade 10') {
      setEmail('alex.rivera@highschool.edu');
      login('alex.rivera@highschool.edu', 'Alex Rivera');
    } else {
      setEmail('maya.lin@highschool.edu');
      login('maya.lin@highschool.edu', 'Maya Lin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-indigo-50/50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/25 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-gray-900 tracking-tight">
          Level Up Learning
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-xs mx-auto">
          The gamified planner for Grade 9 & 10 students to conquer homework, stay focused, and earn XP.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-purple-950/5 border border-purple-100 relative">
          {/* Top Auth Mode Tabs */}
          <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(true);
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                isLoginMode
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                !isLoginMode
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Student Full Name
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Grade Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGrade('Grade 9')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        grade === 'Grade 9'
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      🎒 Grade 9 (Freshman)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrade('Grade 10')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        grade === 'Grade 10'
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      🚀 Grade 10 (Sophomore)
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                School or Personal Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50 hover:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50 hover:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-purple-600/25 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:scale-[1.01] mt-2 min-h-[46px]"
            >
              <span>{isLoginMode ? 'Log In to Dashboard' : 'Create Free Student Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Student Account Login */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center font-medium text-gray-500 mb-3">
              Testing or evaluating? Jump in with a sample student account:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('Grade 10')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl border border-purple-200 transition-colors min-h-[40px]"
              >
                <span>Alex (Grade 10)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Grade 9')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-colors min-h-[40px]"
              >
                <span>Maya (Grade 9)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
