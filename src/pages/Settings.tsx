import { useState, useEffect } from 'react';
import { Bell, Lock } from 'lucide-react';
import Sidebar, { MobileSidebarToggle } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getUserSettings, updateUserSettings, createUserProfile } from '../services/firestore';
import { UserSettings } from '../types/profile';

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [formData, setFormData] = useState({
    emailNotifications: true,
    testReminders: true,
    weeklyReport: true,
    publicProfile: true,
    showEmail: false,
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'en',
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser) return;

      try {
        let userSettings = await getUserSettings(currentUser.uid);

        if (!userSettings) {
          await createUserProfile(
            currentUser.uid,
            currentUser.email || '',
            currentUser.displayName || 'User'
          );
          userSettings = await getUserSettings(currentUser.uid);
        }

        if (userSettings) {
          setSettings(userSettings);
          setFormData({
            emailNotifications: userSettings.emailNotifications,
            testReminders: userSettings.testReminders,
            weeklyReport: userSettings.weeklyReport,
            publicProfile: userSettings.publicProfile,
            showEmail: userSettings.showEmail,
            theme: userSettings.theme,
            language: userSettings.language,
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser]);

  const handleToggle = (key: keyof typeof formData) => {
    setFormData({
      ...formData,
      [key]: !formData[key],
    });
  };

  const handleSelectChange = (key: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      await updateUserSettings(currentUser.uid, formData);
      const updatedSettings = await getUserSettings(currentUser.uid);
      if (updatedSettings) {
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-xl font-['Syne']">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MobileSidebarToggle onClick={() => setIsSidebarOpen(true)} />

      <div className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-['Syne'] bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
              Settings
            </h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold font-['Syne']">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium font-['Syne']">Email Notifications</h3>
                    <p className="text-sm text-gray-600 font-['Syne']">
                      Receive email updates about your account activity
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.emailNotifications ? 'bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium font-['Syne']">Test Reminders</h3>
                    <p className="text-sm text-gray-600 font-['Syne']">
                      Get reminders about upcoming tests and deadlines
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('testReminders')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.testReminders ? 'bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.testReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium font-['Syne']">Weekly Report</h3>
                    <p className="text-sm text-gray-600 font-['Syne']">
                      Receive a summary of your progress every week
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('weeklyReport')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.weeklyReport ? 'bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold font-['Syne']">Privacy</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium font-['Syne']">Public Profile</h3>
                    <p className="text-sm text-gray-600 font-['Syne']">
                      Allow others to view your profile and test scores
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('publicProfile')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.publicProfile ? 'bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.publicProfile ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium font-['Syne']">Show Email</h3>
                    <p className="text-sm text-gray-600 font-['Syne']">
                      Display your email address on your public profile
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('showEmail')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.showEmail ? 'bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.showEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
