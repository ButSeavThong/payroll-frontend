"use client";

import { useState } from "react";
import { useGeneratePayrollMutation } from "@/src/feature/payroll/payrollApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";


function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonth(monthStr: string): string {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GeneratePayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GeneratePayrollModal({
  open,
  onOpenChange,
  onSuccess,
}: GeneratePayrollModalProps) {
  const [generatePayroll, { isLoading }] = useGeneratePayrollMutation();
  const [mode, setMode] = useState<"all" | "specific">("all");
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(getCurrentMonth());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "specific" && !employeeId) {
      toast.error("Please enter an employee ID");
      return;
    }

    // ✅ employeeId must be number | null — parse it properly
    const parsedEmployeeId =
      mode === "specific" ? parseInt(employeeId, 10) : null;

    if (mode === "specific" && isNaN(parsedEmployeeId!)) {
      toast.error("Employee ID must be a valid number");
      return;
    }

    try {
      const result = await generatePayroll({
        employeeId: parsedEmployeeId, // ✅ number | null
        month,
      }).unwrap();

      const count = result.length;
      toast.success(
        `Payroll generated for ${count} employee(s) — ${formatMonth(month)}`,
      );

      setEmployeeId("");
      setMode("all");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to generate payroll");
    }
  };

  const handleClose = () => {
    setEmployeeId("");
    setMode("all");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Payroll</DialogTitle>
          <DialogDescription>
            Create payroll records for the selected month
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Month picker */}
          <div className="space-y-2">
            <Label htmlFor="month">Month *</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Mode selector */}
          <div className="space-y-3">
            <Label>Generate For</Label>
            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as "all" | "specific")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" disabled={isLoading} />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All active employees
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="specific"
                  id="specific"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="specific"
                  className="font-normal cursor-pointer"
                >
                  Specific employee
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Employee ID input — only shown for specific mode */}
          {mode === "specific" && (
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                type="number" // ✅ number input prevents letters
                placeholder="Enter employee ID (number)"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isLoading}
                min={1}
              />
            </div>
          )}

          {/* Info note */}
          <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-2">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Payroll is calculated from attendance
              records for the selected month. Overtime = hours beyond 8h/day ×
              1.5x rate.
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
              {isLoading ? "Generating..." : "Generate Payroll"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
