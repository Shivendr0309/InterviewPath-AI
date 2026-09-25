import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUser, FaSave, FaCamera } from "react-icons/fa";

import api from "../api/axios";

import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import Education from "../components/profile/Education";
import Skills from "../components/profile/Skills";
import Projects from "../components/profile/Projects";
import Experience from "../components/profile/Experience";
import CodingProfiles from "../components/profile/CodingProfiles";
import ResumeSection from "../components/profile/ResumeSection";
import TargetCompanies from "../components/profile/TargetCompanies";

import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const emptyEducation = {
  degree: "",
  college: "",
  field: "",
  startYear: "",
  endYear: "",
  percentage: "",
};

function Profile() {
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    profileImage: "",
    profileImageFile: null,

    phone: "",
    city: "",
    state: "",
    dateOfBirth: "",
    headline: "",

    education: [{ ...emptyEducation }],

    skills: [],
    projects: [],
    experiences: [],

    codingProfiles: {
      github: "",
      linkedin: "",
      leetcode: "",
      geeksforgeeks: "",
    },

    targetCompanies: "",
  });

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        if (res.data.success) {
          const data = res.data.profile;

          setProfile({
            fullName: data.fullName || "",
            email: data.email || "",
            profileImage: data.profileImage || "",
            profileImageFile: null,

            phone: data.phone || "",
            city: data.city || "",
            state: data.state || "",
            dateOfBirth: data.dateOfBirth || "",
            headline: data.headline || "",

            education:
              data.education?.length > 0
                ? data.education
                : [{ ...emptyEducation }],

            skills: data.skills || [],
            projects: data.projects || [],
            experiences: data.experiences || [],

            codingProfiles: {
              github: data.codingProfiles?.github || "",
              linkedin: data.codingProfiles?.linkedin || "",
              leetcode: data.codingProfiles?.leetcode || "",
              geeksforgeeks:
                data.codingProfiles?.geeksforgeeks || "",
            },

            targetCompanies: data.targetCompanies || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =====================================================
  // UPLOAD PROFILE IMAGE
  // =====================================================

  const handleImageUpload = async () => {
    if (!profile.profileImageFile) {
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append(
        "profileImage",
        profile.profileImageFile
      );

      const res = await api.post(
        "/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const imageUrl =
          `${import.meta.env.VITE_API_URL}${res.data.profileImage}`;

        setProfile((prev) => ({
          ...prev,
          profileImage: imageUrl,
          profileImageFile: null,
        }));

        updateUser({
          profileImage: imageUrl,
        });

        toast.success(
          "Profile image updated successfully!"
        );
      }
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to upload profile image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Upload image first if a new image was selected
      if (profile.profileImageFile) {
        await handleImageUpload();
      }

      const {
        profileImageFile,
        ...profileData
      } = profile;

      const res = await api.put(
        "/profile",
        profileData
      );

      if (res.data.success) {
        updateUser({
          fullName:
            res.data.profile.fullName,

          email:
            res.data.profile.email,

          profileImage:
            res.data.profile.profileImage,
        });

        setProfile((prev) => ({
          ...prev,
          profileImage:
            res.data.profile.profileImage ||
            prev.profileImage,
          profileImageFile: null,
        }));

        toast.success(
          "Profile saved successfully!"
        );
      }
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <DashboardLayout
        title="My Profile"
        subtitle="Manage your personal information and career profile."
      >
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">

            <div className="
              w-10 h-10
              border-4
              border-[var(--secondary)]
              border-t-[var(--primary)]
              rounded-full
              animate-spin
              mx-auto
            " />

            <p className="
              text-sm
              text-gray-500
              mt-4
            ">
              Loading your profile...
            </p>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="Manage your personal information, education, skills, projects and career preferences."
    >

      <div className="
        max-w-7xl
        mx-auto
        px-1
        py-4
      ">

        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <div className="mb-7">

          <div className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            bg-white
            border border-[var(--secondary)]
            text-[var(--primary)]
            text-xs
            font-semibold
          ">
            <FaUser className="text-[10px]" />
            YOUR PROFESSIONAL PROFILE
          </div>

          <h1 className="
            text-3xl
            md:text-4xl
            font-bold
            text-[var(--text)]
            mt-4
          ">
            Build your professional identity
          </h1>

          <p className="
            text-gray-500
            mt-2
            max-w-2xl
          ">
            Keep your profile updated so InterviewPath AI
            can better understand your background and career goals.
          </p>

        </div>

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <section className="
          bg-white
          border border-[var(--secondary)]
          rounded-3xl
          overflow-hidden
          mb-7
        ">

          <div className="
            h-24
            bg-[var(--primary)]
            relative
            overflow-hidden
          ">

            <div className="
              absolute
              -right-10
              -top-24
              w-56
              h-56
              rounded-full
              bg-white/5
            />

            <div className="
              absolute
              right-32
            
              w-40
              h-40
              rounded-full
              
            />

          </div>

          <div className="px-6 md:px-8 pb-7">

            <div className="
              -mt-10
              relative
              z-10
            ">
              <ProfileHeader
                profile={profile}
                setProfile={setProfile}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            IMAGE UPLOAD STATUS
        ================================================= */}

        {profile.profileImageFile && (
          <div className="
            mb-7
            bg-[var(--background)]
            border border-[var(--secondary)]
            rounded-2xl
            px-5
            py-4
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-9
                h-9
                rounded-lg
                bg-white
                text-[var(--primary)]
                flex
                items-center
                justify-center
              ">
                <FaCamera />
              </div>

              <div>
                <p className="
                  text-sm
                  font-semibold
                  text-[var(--text)]
                ">
                  New profile photo selected
                </p>

                <p className="
                  text-xs
                  text-gray-500
                  mt-0.5
                ">
                  Click Save Profile to upload it.
                </p>
              </div>

            </div>

            {uploadingImage && (
              <span className="
                text-sm
                font-medium
                text-[var(--primary)]
              ">
                Uploading photo...
              </span>
            )}

          </div>
        )}

        {/* =================================================
            PERSONAL & EDUCATION
        ================================================= */}

        <section className="mb-8">

          <ProfileSectionHeader
            title="Personal & Education"
            description="Your basic information and academic background."
          />

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          ">

            <PersonalInfo
              profile={profile}
              setProfile={setProfile}
            />

            <Education
              education={profile.education}
              setProfile={setProfile}
            />

          </div>

        </section>

        {/* =================================================
            EXPERIENCE & PROJECTS
        ================================================= */}

        <section className="mb-8">

          <ProfileSectionHeader
            title="Experience & Projects"
            description="Showcase the work and experience that represent your technical journey."
          />

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          ">

            <Experience
              experiences={profile.experiences}
              setProfile={setProfile}
            />

            <Projects
              projects={profile.projects}
              setProfile={setProfile}
            />

          </div>

        </section>

        {/* =================================================
            SKILLS & CODING
        ================================================= */}

        <section className="mb-8">

          <ProfileSectionHeader
            title="Skills & Coding Profiles"
            description="Highlight your technical skills and developer profiles."
          />

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          ">

            <Skills
              skills={profile.skills}
              setProfile={setProfile}
            />

            <CodingProfiles
              codingProfiles={
                profile.codingProfiles
              }
              setProfile={setProfile}
            />

          </div>

        </section>

        {/* =================================================
            CAREER & RESUME
        ================================================= */}

        <section className="mb-8">

          <ProfileSectionHeader
            title="Career & Resume"
            description="Manage your resume and the companies you want to target."
          />

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          ">

            <ResumeSection />

            <TargetCompanies
              targetCompanies={
                profile.targetCompanies
              }
              setProfile={setProfile}
            />

          </div>

        </section>

        {/* =================================================
            SAVE AREA
        ================================================= */}

        <div className="
          bg-white
          border border-[var(--secondary)]
          rounded-2xl
          p-5
          md:p-6
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          sticky
          bottom-4
          z-10
          shadow-lg
        ">

          <div>

            <p className="
              font-semibold
              text-[var(--text)]
            ">
              Keep your profile updated
            </p>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Save your latest information before leaving this page.
            </p>

          </div>

          <button
            onClick={handleSaveProfile}
            disabled={
              saving || uploadingImage
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-[var(--primary)]
              hover:bg-[var(--accent)]
              text-white
              px-7
              py-3
              rounded-xl
              font-semibold
              text-sm
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
              shrink-0
            "
          >

            <FaSave />

            {uploadingImage
              ? "Uploading Photo..."
              : saving
              ? "Saving..."
              : "Save Profile"}

          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

// =====================================================
// PROFILE SECTION HEADER
// =====================================================

function ProfileSectionHeader({
  title,
  description,
}) {
  return (
    <div className="mb-5">

      <h2 className="
        text-xl
        font-bold
        text-[var(--text)]
      ">
        {title}
      </h2>

      <p className="
        text-sm
        text-gray-500
        mt-1
      ">
        {description}
      </p>

    </div>
  );
}

export default Profile;