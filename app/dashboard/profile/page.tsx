"use client";

import { useEffect, useState } from "react";
import { userApi, ApiError, type UserProfile } from "@/lib/api";
import { setSessionUser } from "@/lib/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    userApi
      .getProfile()
      .then((p) => {
        setProfile(p);
        setFullName(p.fullName);
        setEmail(p.email);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const updated = await userApi.updateProfile({ fullName, email });
      setProfile(updated);
      setSessionUser({ id: updated.id, fullName: updated.fullName, email: updated.email });
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Could not update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Could not change password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-soft">Loading profile…</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Profile</h1>
        <p className="mt-1 text-ink-soft">
          Member since{" "}
          {profile ? new Date(profile.createdAt).toLocaleDateString() : "—"}
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Your details</h2>
        <form onSubmit={handleProfileSubmit} className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-green"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-green"
            />
          </div>

          {profileError && (
            <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{profileError}</p>
          )}
          {profileSuccess && (
            <p className="rounded-xl bg-green-bright/10 px-4 py-3 text-sm text-green">
              Profile updated.
            </p>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="mt-1 self-start rounded-full bg-green px-6 py-3 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {profileSaving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Current password</label>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-green"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">New password</label>
            <input
              required
              type="password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-green"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-soft">Confirm new password</label>
            <input
              required
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-green"
            />
          </div>

          {passwordError && (
            <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="rounded-xl bg-green-bright/10 px-4 py-3 text-sm text-green">
              Password changed.
            </p>
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="mt-1 self-start rounded-full bg-green px-6 py-3 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {passwordSaving ? "Saving…" : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
