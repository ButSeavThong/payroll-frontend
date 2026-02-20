'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEmployeeMutation } from '@/src/feature/employee/employeeApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const createEmployeeSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  position: z.string().min(2, 'Position is required'),
  baseSalary: z.coerce.number().min(0, 'Salary must be positive'),
  hireDate: z.string().min(1, 'Hire date is required'),
});

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

interface CreateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (employeeId: string) => void;
}

export function CreateEmployeeModal({ open, onOpenChange, onSuccess }: CreateEmployeeModalProps) {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const onSubmit = async (data: CreateEmployeeFormData) => {
    try {
      const response = await createEmployee({
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        position: data.position,
        baseSalary: data.baseSalary,
        hireDate: data.hireDate,
      }).unwrap();

      toast.success(`Employee profile created successfully!`);
      reset();
      onOpenChange(false);
      onSuccess?.(response.id);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create employee profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Employee Profile</DialogTitle>
          <DialogDescription>Add a new employee profile to the system</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must create a User account first (Users tab) to get the User ID.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="Copy from Users tab"
              {...register('userId')}
              disabled={isLoading}
            />
            {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
                disabled={isLoading}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
                disabled={isLoading}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Engineering"
                {...register('department')}
                disabled={isLoading}
              />
              {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Senior Developer"
                {...register('position')}
                disabled={isLoading}
              />
              {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary</Label>
              <Input
                id="baseSalary"
                type="number"
                placeholder="50000"
                {...register('baseSalary')}
                disabled={isLoading}
              />
              {errors.baseSalary && <p className="text-sm text-red-500">{errors.baseSalary.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input
                id="hireDate"
                type="date"
                {...register('hireDate')}
                disabled={isLoading}
              />
              {errors.hireDate && <p className="text-sm text-red-500">{errors.hireDate.message}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
