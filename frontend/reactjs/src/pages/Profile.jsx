import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Lock, Save, FolderOpen, Globe, Eye, EyeOff, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { login } from '../app/features/authSlice';
import api from '../config/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'

  // Stats states
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResumes(data.resumes || []);
    } catch (error) {
      console.error("Failed to load resumes for statistics", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchResumes();
    }
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.put(`/api/users/${user.id}`, { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update redux state with new user data
      dispatch(login({ token, user: data }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/api/users/${user.id}`, { password }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Password updated successfully!");
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  // Stats calculation
  const publicCount = resumes.filter(r => r.is_public).length;
  const privateCount = resumes.length - publicCount;

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Back Link Navigation */}
        <div className="mb-8">
          <Link 
            to="/app" 
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Unified Profile Banner (Horizontal layout - no heavy borders) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
          {/* Subtle brand aurora effect */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#e52d27]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e52d27] to-[#b31217] flex items-center justify-center text-white text-xl font-semibold shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">{user?.name}</h1>
              <p className="text-xs text-slate-400 font-light mt-0.5">{user?.email}</p>
              
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50/60 rounded-full text-[10px] font-semibold text-[#e52d27]">
                <Sparkles className="size-3" />
                {user?.role || 'User'} Account
              </div>
            </div>
          </div>

          {/* Quick Metrics (Horizontal bar with dividers) */}
          <div className="flex items-center gap-8 sm:gap-12 bg-slate-50/80 rounded-2xl px-6 py-4 border border-slate-100/60">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total</span>
              <span className="block text-base font-bold text-slate-800 mt-0.5">{resumes.length}</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Public</span>
              <span className="block text-base font-bold text-emerald-600 mt-0.5">{publicCount}</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Private</span>
              <span className="block text-base font-bold text-slate-500 mt-0.5">{privateCount}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Left Panel: Desktop Sidebar settings navigation (hidden on mobile) */}
          <div className="hidden md:flex md:flex-col gap-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">Settings Menu</h3>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-rose-50/60 text-[#e52d27]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="size-4" />
                <span>Profile Info</span>
              </div>
              <ChevronRight className={`size-3 transition-transform ${activeTab === 'profile' ? 'opacity-100 translate-x-0.5' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-rose-50/60 text-[#e52d27]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="size-4" />
                <span>Password</span>
              </div>
              <ChevronRight className={`size-3 transition-transform ${activeTab === 'security' ? 'opacity-100 translate-x-0.5' : 'opacity-0'}`} />
            </button>
          </div>

          {/* Right Panel: Aesthetic Form Container (contains top tabs on mobile) */}
          <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            
            {/* Tab Selector Buttons (Mobile only - inside the upper form box) */}
            <div className="flex md:hidden border-b border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 text-center transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'profile'
                    ? 'border-[#e52d27] text-[#e52d27] bg-white'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/20'
                }`}
              >
                <User className="size-3.5" />
                Profile Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 text-center transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'security'
                    ? 'border-[#e52d27] text-[#e52d27] bg-white'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/20'
                }`}
              >
                <Shield className="size-3.5" />
                Password
              </button>
            </div>

            {/* Inner Padding wrapper for content */}
            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-bold text-slate-800 mb-1">
                {activeTab === 'profile' ? 'Profile Details' : 'Change Password'}
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-light">
                {activeTab === 'profile' 
                  ? 'Update your personal profile information here.' 
                  : 'Choose a strong, unique password to secure your account.'}
              </p>

              {activeTab === 'profile' ? (
                /* Profile Info Form */
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">User ID</label>
                      <input
                        type="text"
                        value={user?.id || ''}
                        disabled
                        className="w-full px-4 py-2 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-xs cursor-not-allowed font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Date Joined</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 size-3.5 text-slate-300" />
                        <input
                          type="text"
                          value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'July 2026'}
                          disabled
                          className="w-full pl-9 pr-4 py-2 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-xs cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-2.5 size-3.5 text-slate-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-2 border border-slate-100 bg-slate-50/80 text-slate-400 rounded-xl text-xs cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name-input" className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-2.5 size-3.5 text-slate-400" />
                      <input
                        id="name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-[#e52d27] transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-95 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="size-3.5" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Security / Password Form */
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div>
                    <label htmlFor="new-password-input" className="block text-xs font-medium text-slate-500 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-2.5 size-3.5 text-slate-400" />
                      <input
                        id="new-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-[#e52d27] transition-all bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password-input" className="block text-xs font-medium text-slate-500 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-2.5 size-3.5 text-slate-400" />
                      <input
                        id="confirm-password-input"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-[#e52d27] transition-all bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-95 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="size-3.5" />
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
