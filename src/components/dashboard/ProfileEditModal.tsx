"use client";

import React, { useState } from "react";
import { Check, User, BookOpen } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import type { ResearcherProfile } from "@/lib/auth-context";
import {
  primaryBtnClass,
  outlineBtnClass,
  inputClass,
  textareaClass,
  ModalShell,
  Field,
} from "@/components/dashboard/ui";

interface ProfileEditModalProps {
  profile: ResearcherProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<ResearcherProfile>) => void;
}

export default function ProfileEditModal({
  profile,
  isOpen,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    role: profile.role || "",
    domain: profile.domain || "",
    institution: profile.institution || "",
    bio: profile.bio || "",
    githubHandle: profile.githubHandle || "",
    orcidId: profile.orcidId || "",
    scholarUrl: profile.scholarUrl || "",
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onSave(formData);
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 300);
  };

  return (
    <ModalShell
      titleId="profile-modal-title"
      icon={<User className="w-5 h-5" />}
      accent="lime"
      title="تعديل الملف الأكاديمي والمهني"
      desc="تحديث بياناتك وهويتك البحثية في أرشيف JEMO"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Field label="الاسم الكامل / الأكاديمي">
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="المسمى الأكاديمي / الدور">
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="مجال البحث الدقيق">
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="المؤسسة الأكاديمية / المختبر">
          <input
            type="text"
            placeholder="مثال: جامعة بغداد، أو مستقل (Independent)"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="نبذة بحثية موجزة (Bio)">
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="اكتب نبذة عن مسيرتك ومجالات اهتمامك العلمي..."
            className={textareaClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Field
            label={
              <span className="flex items-center gap-1">
                <GithubIcon className="w-3.5 h-3.5" />
                <span>رابط GitHub</span>
              </span>
            }
          >
            <input
              type="text"
              dir="ltr"
              placeholder="https://github.com/username"
              value={formData.githubHandle}
              onChange={(e) => setFormData({ ...formData, githubHandle: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </Field>
          <Field
            label={
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>معرف ORCID</span>
              </span>
            }
          >
            <input
              type="text"
              dir="ltr"
              placeholder="0000-0002-1825-0097"
              value={formData.orcidId}
              onChange={(e) => setFormData({ ...formData, orcidId: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </Field>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e4e3e3]">
          <button
            type="button"
            onClick={onClose}
            className={outlineBtnClass}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving}
            className={primaryBtnClass}
          >
            <Check className="w-4 h-4 text-[#bef264]" />
            <span>{saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}</span>
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
