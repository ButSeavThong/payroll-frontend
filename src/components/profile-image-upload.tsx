// src/components/profile-image-upload.tsx
"use client";

import { useRef, useState } from "react";
import {
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
} from "@/src/feature/user/userApi";
import { toast } from "sonner";
import { Camera, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ??
  "http://localhost:8080";

export function getAvatarUrl(
  profileImage: string | null | undefined,
): string | null {
  if (!profileImage) return null;
  // If already a full URL return as-is
  if (profileImage.startsWith("http")) return profileImage;
  return `${API_BASE}/uploads/profile-images/${profileImage}`;
}

// ─── Avatar display ───────────────────────────────────────────────────────────

export function Avatar({
  profileImage,
  name,
  size = "md",
}: {
  profileImage?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-xl",
    xl: "w-24 h-24 text-3xl",
  };
  const url = getAvatarUrl(profileImage);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeMap[size]} rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center`}
    >
      {url ? (
        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initial if image fails to load
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span className="text-white font-bold">{initial}</span>
      )}
    </div>
  );
}

// ─── Upload Component ─────────────────────────────────────────────────────────

interface ProfileImageUploadProps {
  currentImage?: string | null;
  name: string;
  onSuccess?: () => void;
}

export function ProfileImageUpload({
  currentImage,
  name,
  onSuccess,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [uploadImage, { isLoading: uploading }] =
    useUploadProfileImageMutation();
  const [removeImage, { isLoading: removing }] =
    useRemoveProfileImageMutation();

  const isLoading = uploading || removing;

  // ── Process file ────────────────────────────────────────────────────────
  const processFile = async (file: File) => {
    // Client-side validation
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadImage(formData).unwrap();
      toast.success("Profile image updated!");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Upload failed");
      setPreview(null);
    }
  };

  // ── Drag & Drop ─────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // ── Remove ───────────────────────────────────────────────────────────────
  const handleRemove = async () => {
    try {
      await removeImage().unwrap();
      setPreview(null);
      toast.success("Profile image removed");
      onSuccess?.();
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const displayUrl = preview ?? getAvatarUrl(currentImage);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar preview + drag target */}
      <div
        className={`relative w-28 h-28 rounded-3xl overflow-hidden cursor-pointer
          border-2 border-dashed transition-all
          ${
            dragOver
              ? "border-emerald-400 bg-emerald-50 scale-105"
              : "border-slate-200 hover:border-emerald-300"
          }`}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Image or initial */}
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{initial}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          {isLoading ? (
            <Loader2 size={22} className="text-white animate-spin" />
          ) : (
            <Camera size={22} className="text-white" />
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          e.target.value = "";
        }}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          disabled={isLoading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={12} />
          {displayUrl ? "Change" : "Upload"}
        </Button>

        {(displayUrl || currentImage) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-red-200 text-red-600 hover:bg-red-50"
            disabled={isLoading}
            onClick={handleRemove}
          >
            {removing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        JPEG, PNG or WebP · Max 5MB
        <br />
        Click or drag & drop to upload
      </p>
    </div>
  );
}
