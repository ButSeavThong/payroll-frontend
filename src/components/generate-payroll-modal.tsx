'use client';

import { useState } from 'react';
import { useGeneratePayrollMutation } from '@/src/feature/payroll/payrollApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getCurrentMonth, formatMonth } from '@/src/lib/utils';

interface GeneratePayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GeneratePayrollModal({ open, onOpenChange, onSuccess }: GeneratePayrollModalProps) {
  const [generatePayroll, { isLoading }] = useGeneratePayrollMutation();
  const [mode, setMode] = useState<'all' | 'specific'>('all');
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState(getCurrentMonth());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'specific' && !employeeId) {
      toast.error('Please enter an employee ID');
      return;
    }

    try {
      await generatePayroll({
        employeeId: mode === 'specific' ? employeeId : undefined,
        month,
      }).unwrap();

      toast.success(`Payroll generated successfully for ${formatMonth(month)}`);
      setEmployeeId('');
      setMode('all');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to generate payroll');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Payroll</DialogTitle>
          <DialogDescription>Create payroll records for the selected month</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label>Generate For</Label>
            <RadioGroup value={mode} onValueChange={(value: any) => setMode(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" disabled={isLoading} />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All active employees
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" disabled={isLoading} />
                <Label htmlFor="specific" className="font-normal cursor-pointer">
                  Specific employee
                </Label>
              </div>
            </RadioGroup>
          </div>

          {mode === 'specific' && (
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

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
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
