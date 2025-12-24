import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, MapPin, Link as LinkIcon, Github, Linkedin, Briefcase, Tag } from 'lucide-react';
import Sidebar, { MobileSidebarToggle } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, createUserProfile } from '../services/firestore';
import { UserProfile } from '../types/profile';

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    company: '',
    role: '',
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      try {
        let userProfile = await getUserProfile(currentUser.uid);

        if (!userProfile) {
          await createUserProfile(
            currentUser.uid,
            currentUser.email || '',
            currentUser.displayName || 'User'
          );
          userProfile = await getUserProfile(currentUser.uid);
        }

        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            displayName: userProfile.displayName || '',
            bio: userProfile.bio || '',
            location: userProfile.location || '',
            website: userProfile.website || '',
            github: userProfile.github || '',
            linkedin: userProfile.linkedin || '',
            company: userProfile.company || '',
            role: userProfile.role || '',
            skills: userProfile.skills || [],
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      await updateUserProfile(currentUser.uid, formData);
      const updatedProfile = await getUserProfile(currentUser.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        company: profile.company || '',
        role: profile.role || '',
        skills: profile.skills || [],
      });
    }
    setIsEditing(false);
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
              Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] font-medium hover:shadow-lg transition-shadow"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-['Syne'] font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="text-2xl font-bold font-['Syne'] border-b-2 border-gray-300 focus:border-purple-500 outline-none"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold font-['Syne']">{profile?.displayName}</h2>
                )}
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="font-['Syne']">{profile?.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 font-['Syne']">{profile?.bio || 'No bio added yet.'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-700 font-['Syne']">{profile?.location || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <p className="text-gray-700 font-['Syne']">
                      {profile?.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          {profile.website}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="username"
                    />
                  ) : (
                    <p className="text-gray-700 font-['Syne']">
                      {profile?.github ? (
                        <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          @{profile.github}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="username"
                    />
                  ) : (
                    <p className="text-gray-700 font-['Syne']">
                      {profile?.linkedin ? (
                        <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          @{profile.linkedin}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="Company name"
                    />
                  ) : (
                    <p className="text-gray-700 font-['Syne']">{profile?.company || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                    Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="Your role"
                    />
                  ) : (
                    <p className="text-gray-700 font-['Syne']">{profile?.role || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-full text-sm font-['Syne'] flex items-center gap-2"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-white/20 rounded-full"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-['Syne']"
                      placeholder="Add a skill..."
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] hover:shadow-lg transition-shadow"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
