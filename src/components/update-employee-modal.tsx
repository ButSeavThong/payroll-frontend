// src/components/update-employee-modal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateEmployeeMutation } from "@/src/feature/employee/employeeApi";
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
import { toast } from "sonner";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateEmployeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  baseSalary: z.coerce
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be greater than 0"),
});

type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpdateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Pre-fill the form with current employee data
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    baseSalary: number;
  } | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpdateEmployeeModal({
  open,
  onOpenChange,
  employee,
}: UpdateEmployeeModalProps) {
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateEmployeeFormData>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  // ✅ Pre-fill form whenever selected employee changes
  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        department: employee.department,
        position: employee.position,
        baseSalary: employee.baseSalary,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: UpdateEmployeeFormData) => {
    if (!employee) return;

    try {
      await updateEmployee({
        id: employee.id,
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          department: data.department,
          position: data.position,
          baseSalary: data.baseSalary,
        },
      }).unwrap();

      toast.success(`${data.firstName} ${data.lastName} updated successfully!`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update employee");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Employee Profile</DialogTitle>
          <DialogDescription>
            Edit employee details — changes are saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First + Last Name */}
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
                placeholder="Engineering"
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
                placeholder="Backend Developer"
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

          {/* Base Salary */}
          <div className="space-y-2">
            <Label htmlFor="baseSalary">Base Salary (USD) *</Label>
            <Input
              id="baseSalary"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="3000.00"
              {...register("baseSalary")}
              disabled={isLoading}
            />
            {errors.baseSalary && (
              <p className="text-sm text-red-500">
                {errors.baseSalary.message}
              </p>
            )}
          </div>

          {/* Info note */}
          <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
            <p className="text-xs text-slate-500">
              <strong>Note:</strong> User ID and hire date cannot be changed. To
              change login credentials, use the Users tab.
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
