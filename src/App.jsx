import React, { useState, useContext, createContext, useEffect, useRef } from 'react';
import { Flame, Shield, Ambulance, MapPin, Clock, Phone, AlertCircle, Activity, CheckCircle, XCircle, Calendar, Search, X, LogOut, FileText, Download, Loader2, Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react';
import axios from 'axios';



// ==================== AUTH CONTEXT ====================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (role, email) => setUser({ role, email });
  const logout = () => setUser(null);
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ==================== DEPARTMENT CREDENTIALS ====================
// In production, move this to backend auth — never hardcode in real apps
const DEPARTMENT_CREDENTIALS = {
  fire: {
    email: 'fire@sos.com',
    password: 'fire1234',
    label: 'Fire Brigade HQ',
    role: 'fire',
    gradient: 'from-orange-500 to-red-600',
    accentColor: 'orange',
    icon: Flame,
  },
  police: {
    email: 'police@sos.com',
    password: 'police1234',
    label: 'Police Command',
    role: 'police',
    gradient: 'from-blue-500 to-cyan-600',
    accentColor: 'blue',
    icon: Shield,
  },
  ambulance: {
    email: 'ambulance@sos.com',
    password: 'ambulance1234',
    label: 'Ambulance Control',
    role: 'ambulance',
    gradient: 'from-red-500 to-pink-600',
    accentColor: 'red',
    icon: Ambulance,
  },
};

// ==================== MOCK DATA ====================
const mockAlerts = {
  fire: [],
  police: [
    { id: 'P001', caller: 'Sara Malik', phone: '+92-345-7778888', location: 'Defence Phase 6', type: 'Robbery In Progress', status: 'active', time: '14:20', date: '26 Oct 2025', severity: 'high', lat: 24.8017, lng: 67.0650 },
    { id: 'P002', caller: 'Bilal Sheikh', phone: '+92-312-4445566', location: 'Saddar Regal Chowk', type: 'Street Violence', status: 'active', time: '14:15', date: '26 Oct 2025', severity: 'high', lat: 24.8546, lng: 67.0093 },
  ],
  ambulance: [
    { id: 'A001', caller: 'Imran Siddiqui', phone: '+92-333-1112233', location: 'Korangi Industrial Area', type: 'Heart Attack', status: 'active', time: '14:22', date: '26 Oct 2025', severity: 'high', lat: 24.8256, lng: 67.1064 },
    { id: 'A002', caller: 'Nadia Karim', phone: '+92-321-4445555', location: 'Bahadurabad Main Road', type: 'Road Accident', status: 'active', time: '14:17', date: '26 Oct 2025', severity: 'high', lat: 24.8769, lng: 67.0644 },
  ]
};

// ==================== OTP MODAL ====================
const OTPModal = ({ alert, onClose, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const backendOTP = '1234';

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (otp === backendOTP) {
      setIsVerifying(false);
      onSuccess(alert.id);
      onClose();
    } else {
      setIsVerifying(false);
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-xl border-2 border-slate-700 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-400" />
            Verify OTP - {alert.id}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-4">
            <p className="text-blue-400 text-sm">🔒 Enter the OTP received from the victim to mark this case as resolved.</p>
          </div>

          <div className="mb-4">
            <label className="text-slate-300 font-semibold mb-2 block">Enter OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 4-6 digit OTP"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-green-500 transition-colors"
              disabled={isVerifying}
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm font-semibold">{error}</p>
            </div>
          )}

          <div className="bg-slate-800 rounded-lg p-3 mb-4">
            <p className="text-slate-400 text-xs">
              <span className="font-semibold text-slate-300">Demo OTP:</span> 1234
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} disabled={isVerifying} className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.length < 4}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  Verify & Resolve
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CASE DESCRIPTION MODAL ====================
const CaseDescriptionModal = ({ alert, onClose }) => {
  const [activeTab, setActiveTab] = useState('english');

  const caseDescriptions = {
    english: {
      default: "Detailed case description will be provided by AI analysis system."
    },
    urdu: {
      default: "تفصیلی کیس کی تفصیل AI تجزیہ کار نظام کے ذریعے فراہم کی جائے گی۔"
    }
  };

  const description = caseDescriptions[activeTab][alert.id] || caseDescriptions[activeTab].default;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-xl border-2 border-slate-700 max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Case Description - {alert.id}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('english')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'english' ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveTab('urdu')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'urdu' ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            اردو (Urdu)
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 text-xs mb-1">Emergency Type</p>
              <p className="text-white font-semibold text-sm">{alert.type}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 text-xs mb-1">Status</p>
              <p className={`font-semibold text-sm ${
                alert.status === 'active' ? 'text-red-400' : 
                alert.status === 'pending' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {alert.status.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 min-h-[200px]">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Detailed Description
            </h4>
            <p className={`text-slate-300 leading-relaxed ${activeTab === 'urdu' ? 'text-right text-lg' : ''}`}>
              {description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 text-xs mb-1">Caller</p>
              <p className="text-white font-semibold text-sm">{alert.caller}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 text-xs mb-1">Location</p>
              <p className="text-white font-semibold text-sm truncate">{alert.location}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 text-xs mb-1">Time</p>
              <p className="text-white font-semibold text-sm">{alert.time}</p>
            </div>
          </div>

          <button onClick={onClose} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAP MODAL ====================
const MapModal = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-xl border-2 border-slate-700 max-w-3xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-400" />
            Live Location - {alert.id}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-800 rounded-lg h-96 flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
              <p className="text-white font-semibold mb-2">{alert.location}</p>
              <p className="text-slate-400 text-sm">Coordinates: {alert.lat}, {alert.lng}</p>
              <p className="text-slate-500 text-xs mt-4 max-w-md mx-auto">
                Demo static map – live GPS integration planned with Google Maps API
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 mb-1">Caller</p>
              <p className="text-white font-semibold">{alert.caller}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 mb-1">Phone</p>
              <p className="text-white font-semibold">{alert.phone}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 mb-1">Emergency Type</p>
              <p className="text-white font-semibold">{alert.type}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-slate-400 mb-1">Time Reported</p>
              <p className="text-white font-semibold">{alert.time} • {alert.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== REPORT MODAL ====================
const ReportModal = ({ onClose, userRole, alerts }) => {
  const [duration, setDuration] = useState('6months');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const deptNames = {
      fire: 'Fire Brigade',
      police: 'Police Department',
      ambulance: 'Ambulance Services'
    };
    
    const content = `Emergency Report - ${deptNames[userRole]}\nPeriod: ${duration}\nTotal Alerts: ${alerts.length}`;
    const blob = new Blob([content], { type: format === 'pdf' ? 'text/plain' : 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${deptNames[userRole]}_${Date.now()}.${format === 'pdf' ? 'txt' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setIsGenerating(false);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-xl border-2 border-slate-700 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Generate Performance Report
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="text-slate-300 font-semibold mb-3 block">Report Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {['6months', '1year'].map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    duration === d ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  <Calendar className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-semibold">Last {d === '6months' ? '6 Months' : '1 Year'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium">
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DATE MODAL ====================
const DateModal = ({ onClose, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-xl border-2 border-slate-700 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Show Data by Date
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-400 mb-4">Select a date to view historical emergency alerts:</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium">
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedDate) {
                  onSelectDate(selectedDate);
                  onClose();
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ALERT CARD ====================
const AlertCard = ({ alert, isTopActive, onViewLocation, onUpdateStatus, onViewDescription }) => {
  const statusColors = {
    active: 'bg-red-500/20 border-red-500 text-red-400',
    pending: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    resolved: 'bg-green-500/20 border-green-500 text-green-400'
  };

  const severityIcons = {
    high: <AlertCircle className="w-5 h-5 text-red-400" />,
    medium: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    low: <AlertCircle className="w-5 h-5 text-blue-400" />
  };

  const statusIcons = {
    active: <Activity className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    resolved: <CheckCircle className="w-4 h-4" />
  };

  return (
    <div className={`bg-slate-800/50 border rounded-lg p-4 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl ${
      isTopActive ? 'border-red-500 shadow-lg shadow-red-900/30 animate-pulse' : 'border-slate-700 hover:border-slate-600'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-sm font-bold">{alert.id}</span>
          {severityIcons[alert.severity]}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDescription(alert)}
            className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            title="View Case Description"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusColors[alert.status]}`}>
            {statusIcons[alert.status]}
            {alert.status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <h3 className="text-white font-semibold text-lg mb-3">{alert.type}</h3>
      
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-slate-300">
          <Phone className="w-4 h-4 text-blue-400" />
          <span>{alert.caller} • {alert.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-4 h-4 text-red-400" />
          <span>{alert.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{alert.time} • {alert.date}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onViewLocation(alert)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <MapPin className="w-4 h-4 text-white" />
          Location
        </button>
        <button 
          onClick={() => onUpdateStatus(alert)}
          disabled={alert.status === 'resolved'}
          className={`py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            alert.status === 'resolved' ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-white" />
          {alert.status === 'resolved' ? 'Resolved' : 'Update'}
        </button>
      </div>
    </div>
  );
};

// ==================== LOGIN FORM (per department) ====================
const LoginForm = ({ dept, onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const Icon = dept.icon;

  const accentMap = {
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      btn: 'bg-orange-500 hover:bg-orange-600',
      focus: 'focus:border-orange-500',
      ring: 'focus:ring-orange-500/20',
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      btn: 'bg-blue-600 hover:bg-blue-700',
      focus: 'focus:border-blue-500',
      ring: 'focus:ring-blue-500/20',
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      btn: 'bg-red-600 hover:bg-red-700',
      focus: 'focus:border-red-500',
      ring: 'focus:ring-red-500/20',
    },
  };

  const accent = accentMap[dept.accentColor];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validate credentials
    if (
      email.trim().toLowerCase() === dept.email &&
      password === dept.password
    ) {
      onLogin(dept.role, email.trim().toLowerCase());
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to department selection
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`bg-gradient-to-br ${dept.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">{dept.label}</h2>
          <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className={`bg-slate-900 border-2 ${accent.border} rounded-2xl p-8 shadow-2xl`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dept.email}
                  required
                  className={`w-full bg-slate-800 border border-slate-700 ${accent.focus} ${accent.ring} focus:ring-2 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={`w-full bg-slate-800 border border-slate-700 ${accent.focus} ${accent.ring} focus:ring-2 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-slate-500 outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg px-4 py-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Demo hint */}
            <div className={`${accent.bg} border ${accent.border} rounded-lg px-4 py-3`}>
              <p className="text-slate-400 text-xs">
                <span className={`font-semibold ${accent.text}`}>Demo credentials — </span>
                Email: <span className="text-slate-300 font-mono">{dept.email}</span>
                {' '}/ Password: <span className="text-slate-300 font-mono">{dept.password}</span>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${accent.btn} text-white py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==================== DEPARTMENT SELECTION ====================
const DepartmentSelect = ({ onSelect }) => {
  const departments = Object.values(DEPARTMENT_CREDENTIALS);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            AI-Powered Emergency Response System
          </h1>
          <p className="text-slate-400">Team SOS • FAST NUCES, Karachi • NIC Innovation Hub</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">System Online</span>
          </div>
          <p className="text-slate-500 text-sm mt-3">Select your department to continue</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {departments.map(dept => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.role}
                onClick={() => onSelect(dept.role)}
                className="bg-slate-900 border-2 border-slate-700 rounded-xl p-8 hover:border-slate-500 hover:shadow-2xl transition-all duration-300 group text-left"
              >
                <div className={`bg-gradient-to-br ${dept.gradient} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{dept.label}</h3>
                <p className="text-slate-400 text-sm mb-3">Access {dept.label} Dashboard</p>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                  <Mail className="w-3 h-3" />
                  {dept.email}
                </div>
                <div className="flex items-center gap-2 mt-3 text-slate-500 text-xs">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Sign in with credentials
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Role-based access control • Secure credential authentication
        </p>
      </div>
    </div>
  );
};

// ==================== LOGIN (orchestrator) ====================
const Login = () => {
  const { login } = useAuth();
  const [selectedDept, setSelectedDept] = useState(null);

  if (selectedDept) {
    const dept = DEPARTMENT_CREDENTIALS[selectedDept];
    return (
      <LoginForm
        dept={dept}
        onBack={() => setSelectedDept(null)}
        onLogin={(role, email) => login(role, email)}
      />
    );
  }

  return <DepartmentSelect onSelect={setSelectedDept} />;
};

// ==================== DASHBOARD ====================
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [otpAlert, setOtpAlert] = useState(null);
  const [descriptionAlert, setDescriptionAlert] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(15);
  const [alerts, setAlerts] = useState(mockAlerts);
  
  const [fireAlerts, setFireAlerts] = useState([]);
  const prevCount = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (user?.role === 'fire') {
      const fetchFireAlerts = async () => {
        try {
          const res = await axios.get("http://localhost:5001/api/victims/alldata");
          const victims = res.data.victims;
          setFireAlerts(victims);
          
          if (victims.length > prevCount.current && prevCount.current > 0) {
            audioRef.current?.play().catch(err => console.log('Audio play error:', err));
          }
          prevCount.current = victims.length;
        } catch (err) {
          console.error('Error fetching fire alerts:', {
            message: err.message,
            config: err.config?.url,
            code: err.code,
            response: err.response?.status,
          });
        }
      };

      fetchFireAlerts();
      const interval = setInterval(fetchFireAlerts, 5000);
      return () => clearInterval(interval);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'fire' && fireAlerts.length > 0) {
      setAlerts(prev => ({
        ...prev,
        fire: fireAlerts
      }));
    }
  }, [fireAlerts, user?.role]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(prev => prev === 1 ? 15 : prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return <Login />;

  const handleStatusUpdate = (alertId) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = { ...prevAlerts };
      updatedAlerts[user.role] = updatedAlerts[user.role].map(alert =>
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      );
      return updatedAlerts;
    });
  };

  const departmentAlerts = alerts[user.role] || [];

  const filteredByDate = departmentAlerts.filter(alert => {
    if (!selectedDate) return true;
    return alert.date === convertDateFormat(selectedDate);
  });

  const searchFiltered = filteredByDate.filter(alert =>
    alert.caller?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAlerts = [...searchFiltered].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return (b.time || '').localeCompare(a.time || '');
  });

  const statusCounts = {
    active: searchFiltered.filter(a => a.status === 'active').length,
    pending: searchFiltered.filter(a => a.status === 'pending').length,
    resolved: searchFiltered.filter(a => a.status === 'resolved').length
  };

  const deptConfig = {
    fire: { name: 'Fire Control Center', icon: Flame, bgClass: 'bg-orange-500/20', iconClass: 'text-orange-400' },
    police: { name: 'Police Command Center', icon: Shield, bgClass: 'bg-blue-500/20', iconClass: 'text-blue-400' },
    ambulance: { name: 'Ambulance Control Center', icon: Ambulance, bgClass: 'bg-red-500/20', iconClass: 'text-red-400' }
  };

  const config = deptConfig[user.role];
  const Icon = config.icon;

  function convertDateFormat(dateStr) {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <audio ref={audioRef} src="/civil-defense-siren-128262.mp3" preload="auto" />

      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`${config.bgClass} p-3 rounded-lg`}>
              <Icon className={`w-8 h-8 ${config.iconClass}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Powered Emergency Response System
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">{config.name} • Karachi Command Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">AI System Active</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400 text-sm">Last updated: {lastUpdate}s ago</span>
            </div>
            {/* Logged-in user email pill */}
            <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300 text-sm font-mono">{user.email}</span>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white font-medium"
            >
              <FileText className="w-5 h-5 text-white" />
              Generate Report
            </button>
            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-red-900/40 border border-slate-700 hover:border-red-700 p-2 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-semibold mb-1">ACTIVE</p>
                <p className="text-white text-3xl font-bold">{statusCounts.active}</p>
              </div>
              <Activity className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-semibold mb-1">PENDING</p>
                <p className="text-white text-3xl font-bold">{statusCounts.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-semibold mb-1">RESOLVED (TODAY)</p>
                <p className="text-white text-3xl font-bold">{statusCounts.resolved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by caller name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowDateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 text-white"
          >
            <Calendar className="w-5 h-5 text-white" />
            Show Data by Date
          </button>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-colors text-slate-300"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {selectedDate ? `Alerts for ${convertDateFormat(selectedDate)}` : `Today's Alerts`}
          </h2>
          <span className="text-slate-400 text-sm">
            Showing {sortedAlerts.length} of {departmentAlerts.length} total alerts
          </span>
        </div>

        {sortedAlerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No alerts found</p>
            <p className="text-slate-500 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search criteria' : 'No emergency alerts for this date'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id || alert._id}
                alert={alert}
                isTopActive={index === 0 && alert.status === 'active'}
                onViewLocation={(alert) => {
                  setSelectedAlert(alert);
                  setShowMapModal(true);
                }}
                onUpdateStatus={(alert) => {
                  setOtpAlert(alert);
                  setShowOTPModal(true);
                }}
                onViewDescription={(alert) => {
                  setDescriptionAlert(alert);
                  setShowDescriptionModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showDateModal && (
        <DateModal
          onClose={() => setShowDateModal(false)}
          onSelectDate={(date) => setSelectedDate(date)}
        />
      )}
      {showMapModal && selectedAlert && (
        <MapModal
          alert={selectedAlert}
          onClose={() => {
            setShowMapModal(false);
            setSelectedAlert(null);
          }}
        />
      )}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          userRole={user.role}
          alerts={departmentAlerts}
        />
      )}
      {showOTPModal && otpAlert && (
        <OTPModal
          alert={otpAlert}
          onClose={() => {
            setShowOTPModal(false);
            setOtpAlert(null);
          }}
          onSuccess={handleStatusUpdate}
        />
      )}
      {showDescriptionModal && descriptionAlert && (
        <CaseDescriptionModal
          alert={descriptionAlert}
          onClose={() => {
            setShowDescriptionModal(false);
            setDescriptionAlert(null);
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

export default App;