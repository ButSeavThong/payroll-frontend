// src/components/onboard-employee-modal.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardEmployeeMutation } from '@/src/feature/employee/employeeApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// ─── Schema ───────────────────────────────────────────────────────────────────

const onboardSchema = z.object({
  // User fields
  username:         z.string().min(2, 'Username must be at least 2 characters'),
  email:            z.string().email('Invalid email address'),
  password:         z.string().min(6, 'Password must be at least 6 characters'),
  confirmedPassword:z.string().min(6, 'Please confirm password'),
  gender:           z.enum(['MALE', 'FEMALE', 'OTHER'], {
                      required_error: 'Gender is required',
                    }),
  dob:              z.string().min(1, 'Date of birth is required'),

  // Employee fields
  firstName:        z.string().min(1, 'First name is required'),
  lastName:         z.string().min(1, 'Last name is required'),
  department:       z.string().min(1, 'Department is required'),
  position:         z.string().min(1, 'Position is required'),
  baseSalary:       z.coerce.number().positive('Salary must be greater than 0'),
  hireDate:         z.string().min(1, 'Hire date is required'),
}).refine(d => d.password === d.confirmedPassword, {
  message: 'Passwords do not match',
  path: ['confirmedPassword'],
});

type OnboardFormData = z.infer<typeof onboardSchema>;

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon, title, subtitle, color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${color} mb-4`}>
      <span>{icon}</span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-70">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OnboardEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardEmployeeModal({ open, onOpenChange }: OnboardEmployeeModalProps) {
  const [onboardEmployee, { isLoading }] = useOnboardEmployeeMutation();
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      hireDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: OnboardFormData) => {
    try {
      const result = await onboardEmployee(data).unwrap();
      toast.success(
        `✅ ${result.firstName} ${result.lastName} onboarded successfully!`,
        { description: 'User account and employee profile created.' }
      );
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to onboard employee');
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Employee</DialogTitle>
          <DialogDescription>
            Creates a login account and HR profile in one step.
            The employee can log in immediately after.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-2">

          {/* ── Section 1: Account Info ──────────────────────────────────── */}
          <SectionHeader
            icon={<User size={16} className="text-blue-600" />}
            title="Login Account"
            color="bg-blue-50 border-blue-200 text-blue-800"
            subtitle="Credentials the employee will use to log in"
          />

          {/* Username + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="e.g. sokdara"
                {...register('username')}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. sokdara@company.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  {...register('password')}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmedPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmedPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  {...register('confirmedPassword')}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmedPassword && (
                <p className="text-xs text-red-500">{errors.confirmedPassword.message}</p>
              )}
            </div>
          </div>

          {/* Gender + DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select
                onValueChange={v => setValue('gender', v as 'MALE' | 'FEMALE' | 'OTHER')}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                max={today}
                {...register('dob')}
                disabled={isLoading}
              />
              {errors.dob && (
                <p className="text-xs text-red-500">{errors.dob.message}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-2" />

          {/* ── Section 2: Employee Profile ──────────────────────────────── */}
          <SectionHeader
            icon={<Briefcase size={16} className="text-emerald-600" />}
            title="Employee Profile"
            color="bg-emerald-50 border-emerald-200 text-emerald-800"
            subtitle="HR information stored in the employee record"
          />

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="e.g. Sok"
                {...register('firstName')}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="e.g. Dara"
                {...register('lastName')}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Department + Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                onValueChange={v => setValue('department', v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT & Programming</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-xs text-red-500">{errors.department.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                placeholder="e.g. Backend Developer"
                {...register('position')}
                disabled={isLoading}
              />
              {errors.position && (
                <p className="text-xs text-red-500">{errors.position.message}</p>
              )}
            </div>
          </div>

          {/* Base Salary + Hire Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary (USD/month) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                  $
                </span>
                <Input
                  id="baseSalary"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="800.00"
                  {...register('baseSalary')}
                  disabled={isLoading}
                  className="pl-7"
                />
              </div>
              {errors.baseSalary && (
                <p className="text-xs text-red-500">{errors.baseSalary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                {...register('hireDate')}
                disabled={isLoading}
              />
              {errors.hireDate && (
                <p className="text-xs text-red-500">{errors.hireDate.message}</p>
              )}
            </div>
          </div>

          {/* Info note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>What happens after submitting:</strong> A login account is
              created with the EMPLOYEE role, an HR profile is linked automatically,
              and a leave balance of <strong>10 annual + 7 sick days</strong> is
              initialized for {new Date().getFullYear()}. The employee can log in immediately.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? 'Creating...' : '✅ Create Employee'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}