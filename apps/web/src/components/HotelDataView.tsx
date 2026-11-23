import React, { useState } from 'react';
import {
  Hotel as HotelIcon,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  CheckCircle,
  Copy,
  Edit2,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HotelDataView: React.FC = () => {
  const { hotel, updateHotel, isLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    restaurantName: hotel?.restaurantName || '',
    ownerName: hotel?.ownerName || '',
    phoneNumber: hotel?.phoneNumber || '',
    ownerPhoneNumber: hotel?.ownerPhoneNumber || '',
    address: hotel?.address || '',
    email: hotel?.email || '',
    ownerEmail: hotel?.ownerEmail || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateHotel(formData);
    if (success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner with Hotel Overview */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#113b3a] text-[#d9e85a] flex items-center justify-center font-bold text-2xl shadow-sm">
            <HotelIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 font-['Space_Grotesk']">
                {hotel?.restaurantName || 'Restaurant Information'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                Active Profile
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Owned and managed by <strong className="text-stone-700">{hotel?.ownerName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#d9e85a]" />
              <span>Edit Hotel Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Restaurant data updated successfully in database via /hotel/update-restro!</span>
        </div>
      )}

      {/* Main Grid: Data Card & System Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotel Information Form/View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                Property & Contact Details
              </h3>
              <p className="text-xs text-stone-500">
                Data used by Baileys WhatsApp bot and Pearson AI Agent.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Restaurant / Hotel Name
                </label>
                <div className="relative">
                  <HotelIcon className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Owner / General Manager Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Hotel WhatsApp Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Owner Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    name="ownerPhoneNumber"
                    value={formData.ownerPhoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Restaurant Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Owner Personal Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Property Street Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={2}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 disabled:bg-stone-50 disabled:text-stone-700 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving Changes...' : 'Save & Sync Backend'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* System Credentials & Thread IDs */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-stone-900 font-['Space_Grotesk']">
                Backend System Identifiers
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-stone-500 mb-1">
                  <span>Conversation Thread ID</span>
                  <button
                    onClick={() => copyToClipboard(hotel?.thread_id || '', 'thread')}
                    className="hover:text-stone-800 flex items-center gap-1"
                  >
                    {copiedKey === 'thread' ? (
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs font-semibold text-stone-900 break-all select-all">
                  {hotel?.thread_id || 'Not assigned'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-stone-500 mb-1">
                  <span>JWT Session Token</span>
                  <button
                    onClick={() => copyToClipboard(hotel?.token || '', 'token')}
                    className="hover:text-stone-800 flex items-center gap-1"
                  >
                    {copiedKey === 'token' ? (
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-stone-600 truncate select-all">
                  {hotel?.token || 'pearson_jwt_verified'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
                  Account Registration
                </span>
                <div className="flex items-center gap-1.5 text-xs text-stone-800">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {hotel?.createdAt
                      ? new Date(hotel.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#eef5f1] border border-[#d2e4d9]">
            <h4 className="text-xs font-bold text-[#113b3a] font-['Space_Grotesk'] mb-1">
              WhatsApp Autonomous Receiver
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              When a guest sends a text or voice note to{' '}
              <strong className="text-stone-800">{hotel?.phoneNumber || 'your number'}</strong>,
              the Baileys session routes it into Kafka topic <code>bot-receiver-connected</code>,
              and the agent processes it instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
