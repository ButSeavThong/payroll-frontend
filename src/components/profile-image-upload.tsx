"use client";

import { useRef, useState } from "react";
import {
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
} from "@/src/feature/user/userApi";
import { toast } from "sonner";
import { Camera, Loader2, Trash2, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ??
  "http://localhost:8080";

export function getAvatarUrl(
  profileImage: string | null | undefined,
): string | null {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  return `${API_BASE}/uploads/profile-images/${profileImage}`;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "U";
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function getAvatarPalette(name: string) {
  const palettes = [
    {
      shell: "from-emerald-500 via-teal-500 to-cyan-500",
      glow: "from-emerald-200/70 via-white/10 to-cyan-200/70",
      badge: "bg-emerald-100/90 text-emerald-700",
    },
    {
      shell: "from-sky-500 via-blue-500 to-indigo-500",
      glow: "from-sky-200/70 via-white/10 to-indigo-200/70",
      badge: "bg-sky-100/90 text-sky-700",
    },
    {
      shell: "from-amber-500 via-orange-500 to-rose-500",
      glow: "from-amber-200/70 via-white/10 to-rose-200/70",
      badge: "bg-amber-100/90 text-amber-700",
    },
    {
      shell: "from-fuchsia-500 via-pink-500 to-rose-500",
      glow: "from-fuchsia-200/70 via-white/10 to-rose-200/70",
      badge: "bg-pink-100/90 text-pink-700",
    },
  ];

  const seed = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palettes[seed % palettes.length];
}

function AvatarVisual({
  imageUrl,
  name,
  roundedClass,
  sizeClass,
  textClass,
  badgeClass,
}: {
  imageUrl?: string | null;
  name: string;
  roundedClass: string;
  sizeClass: string;
  textClass: string;
  badgeClass: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageUrl) && !imageFailed;
  const initials = getInitials(name);
  const palette = getAvatarPalette(name);

  return (
    <div
      className={`${sizeClass} ${roundedClass} relative flex shrink-0 items-center justify-center overflow-hidden border border-white/70 bg-gradient-to-br ${palette.shell} shadow-lg shadow-slate-900/10`}
    >
      {shouldShowImage ? (
        <img
          src={imageUrl ?? undefined}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${palette.glow} opacity-80`}
          />
          <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-white/15 blur-xl" />
          <div className="absolute -bottom-6 -left-2 h-16 w-16 rounded-full bg-slate-950/10 blur-2xl" />
          <div
            className={`absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${badgeClass} ${palette.badge}`}
          >
            <UserRound className="h-3.5 w-3.5" />
          </div>
          <span className={`${textClass} relative font-bold text-white`}>
            {initials}
          </span>
        </>
      )}
    </div>
  );
}

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
    sm: {
      sizeClass: "h-8 w-8",
      textClass: "text-xs",
      badgeClass: "hidden",
    },
    md: {
      sizeClass: "h-10 w-10",
      textClass: "text-sm",
      badgeClass: "hidden",
    },
    lg: {
      sizeClass: "h-14 w-14",
      textClass: "text-xl",
      badgeClass: "hidden",
    },
    xl: {
      sizeClass: "h-24 w-24",
      textClass: "text-3xl",
      badgeClass: "",
    },
  };

  return (
    <AvatarVisual
      imageUrl={getAvatarUrl(profileImage)}
      name={name}
      roundedClass="rounded-2xl"
      sizeClass={sizeMap[size].sizeClass}
      textClass={sizeMap[size].textClass}
      badgeClass={sizeMap[size].badgeClass}
    />
  );
}

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

  const processFile = async (file: File) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

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

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative overflow-hidden rounded-[1.75rem] border-2 border-dashed transition-all ${
          dragOver
            ? "scale-105 border-emerald-400 bg-emerald-50"
            : "border-slate-200/80 bg-white hover:border-emerald-300"
        }`}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <AvatarVisual
          imageUrl={displayUrl}
          name={name}
          roundedClass="rounded-[1.6rem]"
          sizeClass="h-28 w-28"
          textClass="text-4xl"
          badgeClass=""
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
          {isLoading ? (
            <Loader2 size={22} className="animate-spin text-white" />
          ) : (
            <Camera size={22} className="text-white" />
          )}
        </div>
      </div>

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
            className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
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

      <p className="text-center text-xs text-slate-400">
        JPEG, PNG or WebP - Max 5MB
        <br />
        Click or drag & drop to upload
      </p>
    </div>
  );
}
