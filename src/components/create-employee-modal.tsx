"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEmployeeMutation } from "@/src/feature/employee/employeeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const createEmployeeSchema = z.object({
  // ✅ userId must be a number — coerce converts the string input to number
  userId: z.coerce
    .number({ invalid_type_error: "User ID must be a number" })
    .int("User ID must be a whole number")
    .positive("User ID must be positive"),

  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  department: z.string().min(2, "Department is required"),
  position: z.string().min(2, "Position is required"),

  // ✅ baseSalary must be > 0, not >= 0
  baseSalary: z.coerce
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be greater than 0"),

  hireDate: z.string().min(1, "Hire date is required"),
});

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (employeeId: number) => void; // ✅ number not string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateEmployeeModalProps) {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const onSubmit = async (data: CreateEmployeeFormData) => {
    try {
      const response = await createEmployee({
        userId: data.userId, // ✅ already number via z.coerce
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        position: data.position,
        baseSalary: data.baseSalary,
        hireDate: data.hireDate, // "yyyy-MM-dd" — correct format for backend
      }).unwrap();

      toast.success(
        `Employee profile created! ${data.firstName} ${data.lastName} is now active.`,
      );

      onSuccess?.(response.id); // ✅ number
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create employee profile");
    }
  };

  // ✅ Reset form when closing — prevents stale data on reopen
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Employee Profile</DialogTitle>
          <DialogDescription>
            Step 2 of onboarding — links a User account to an HR profile.
          </DialogDescription>
        </DialogHeader>

        {/* Onboarding reminder */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must create a <strong>User account first</strong> (Users tab) to
            get the User ID. Paste it in the field below.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User ID */}
          <div className="space-y-2">
            <Label htmlFor="userId">User ID *</Label>
            <Input
              id="userId"
              type="number" // ✅ number input — prevents letters
              placeholder="Paste User ID from Users tab"
              {...register("userId")}
              disabled={isLoading}
              min={1}
            />
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId.message}</p>
            )}
          </div>

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName")}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Department + Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                {...register("department")}
                disabled={isLoading}
              />
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                placeholder="e.g. Backend Developer"
                {...register("position")}
                disabled={isLoading}
              />
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>
          </div>

          {/* Base Salary + Hire Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary (USD) *</Label>
              <Input
                id="baseSalary"
                type="number"
                placeholder="e.g. 3000"
                step="0.01"
                min="0.01"
                {...register("baseSalary")}
                disabled={isLoading}
              />
              {errors.baseSalary && (
                <p className="text-sm text-red-500">
                  {errors.baseSalary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                {...register("hireDate")}
                disabled={isLoading}
              />
              {errors.hireDate && (
                <p className="text-sm text-red-500">
                  {errors.hireDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose} // ✅ resets form on cancel
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
