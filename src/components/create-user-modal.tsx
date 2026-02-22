"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateUserMutation } from "@/src/feature/user/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const createUserSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmedPassword: z.string(),
    dob: z.string().optional(),
    // ✅ Match exactly what backend accepts: "MALE" | "FEMALE" | "OTHER"
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

type CreateUserFormData = z.infer<typeof createUserSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: (userId: number) => void; // ✅ number not string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateUserModal({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const response = await createUser({
        username: data.username,
        email: data.email,
        password: data.password,
        confirmedPassword: data.confirmedPassword, // ✅ add this
        dob: data.dob,
        gender: data.gender,
      }).unwrap();

      toast.success(
        `User created! ID: ${response.id} — go to Employees tab to create their profile.`,
      );
      onUserCreated?.(response.id);
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user");
    }
  };

  const handleClose = () => {
    reset(); // clear form on cancel
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Step 1 of onboarding — creates the login account. Note the User ID
            to create the employee profile next.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="e.g. john.doe"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john@company.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmedPassword">Confirm Password *</Label>
            <Input
              id="confirmedPassword"
              type="password"
              placeholder="Re-enter password"
              {...register("confirmedPassword")}
              disabled={isLoading}
            />
            {errors.confirmedPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmedPassword.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              {...register("dob")}
              disabled={isLoading}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              onValueChange={(value) =>
                setValue("gender", value as "MALE" | "FEMALE" | "OTHER")
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {/* ✅ Values match backend enum exactly */}
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role info — read only, backend defaults to EMPLOYEE */}
          <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
            <p className="text-xs text-slate-500">
              <strong>Role:</strong> EMPLOYEE (default) — assigned automatically
              by the system.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
