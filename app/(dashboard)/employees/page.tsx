// app/(dashboard)/employees/page.tsx
'use client';
import { Avatar } from '@/src/components/profile-image-upload';
import { useState } from 'react';
import { useAppSelector } from '@/src/hooks';
import {
  useGetEmployeesQuery,
  useGetMyProfileQuery,
  useUpdateEmployeeMutation,
} from '@/src/feature/employee/employeeApi';
import { OnboardEmployeeModal } from '@/src/components/onboard-employee-modal';
import { UpdateEmployeeModal } from '@/src/components/update-employee-modal';
import { LoadingTable } from '@/src/components/loading-table';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, UserCheck, FileSpreadsheet, FileText } from 'lucide-react';
import {
  exportEmployeesToExcel,
  exportEmployeesToPdf,
  type EmployeeRecord as ExportEmployeeRecord,
} from '@/src/lib/exportUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isActive
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-red-100 text-red-800'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
      }`} />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

// ─── Selected employee type ───────────────────────────────────────────────────

interface SelectedEmployee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  baseSalary: number;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const role    = useAppSelector(s => s.auth.role);
  const isAdmin = role === 'ADMIN';

  const [onboardOpen, setOnboardOpen]         = useState(false);
  const [updateOpen,  setUpdateOpen]           = useState(false);
  const [selectedEmp, setSelectedEmp]          = useState<SelectedEmployee | null>(null);

  const { data: employees, isLoading }         = useGetEmployeesQuery(undefined, { skip: !isAdmin });
  const { data: myProfile, isLoading: myLoad } = useGetMyProfileQuery(undefined, { skip: isAdmin });

  const handleEditClick = (emp: SelectedEmployee) => {
    setSelectedEmp(emp);
    setUpdateOpen(true);
  };

  // ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Your employee information</p>
        </div>

        {myLoad ? (
          <Card>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ) : myProfile ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {myProfile.firstName.charAt(0)}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {myProfile.firstName} {myProfile.lastName}
                  </CardTitle>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {myProfile.position} · {myProfile.department}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: 'First Name',  value: myProfile.firstName },
                  { label: 'Last Name',   value: myProfile.lastName },
                  { label: 'Username',    value: `@${myProfile.username}` },
                  { label: 'Email',       value: myProfile.email || '—' },
                  { label: 'Department',  value: myProfile.department || '—' },
                  { label: 'Position',    value: myProfile.position || '—' },
                  { label: 'Base Salary', value: formatSalary(myProfile.baseSalary) },
                  { label: 'Hire Date',   value: formatDate(myProfile.hireDate) },
                ].map(field => (
                  <div key={field.label} className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                      {field.label}
                    </p>
                    <p className="font-semibold text-slate-900">{field.value}</p>
                  </div>
                ))}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                    Status
                  </p>
                  <ActiveBadge isActive={myProfile.isActive} />
                </div>
              </div>

              <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <p className="text-xs text-blue-700">
                  To update your profile information, please contact your HR administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-slate-500">
                No employee profile found. Contact your administrator.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ── ADMIN VIEW ────────────────────────────────────────────────────────────
  const active   = employees?.filter(e => e.isActive).length  ?? 0;
  const inactive = employees?.filter(e => !e.isActive).length ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage employee profiles — account + HR profile created together
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* ✅ Export buttons — only shown when data is loaded */}
          {employees && employees.length > 0 && (
            <>
              <Button
                variant="outline"
                className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => exportEmployeesToExcel(employees as ExportEmployeeRecord[])}
              >
                <FileSpreadsheet size={15} /> Excel
              </Button>
              <Button
                variant="outline"
                className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => exportEmployeesToPdf(employees as ExportEmployeeRecord[])}
              >
                <FileText size={15} /> PDF
              </Button>
            </>
          )}
          <Button
            onClick={() => setOnboardOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Employees',
            value: employees?.length ?? 0,
            color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200',
          },
          {
            label: 'Active',
            value: active,
            color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Inactive',
            value: inactive,
            color: 'text-red-600', bg: 'bg-red-50 border-red-200',
          },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {s.label}
            </p>
            <p className={`text-4xl font-bold ${s.color}`}
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {employees?.length ?? 0} employee(s) ·
            Account + HR profile are created together
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={9} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees && employees.length > 0 ? (
                    employees.map(emp => (
                      <TableRow
                        key={emp.id}
                        className={!emp.isActive ? 'bg-red-50/30 opacity-70' : ''}
                      >
                        {/* ID */}
                        <TableCell>
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {emp.id}
                          </span>
                        </TableCell>

                        {/* Name + avatar */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                           
                            {/* <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                              emp.isActive
                                ? 'bg-gradient-to-br from-emerald-400 to-blue-500'
                                : 'bg-slate-300'
                            }`}>
                              {emp.firstName.charAt(0)}
                            </div> */}

                            <Avatar
                          profileImage={emp.profileImage}  // add this to EmployeeResponse if not there
                          name={emp.firstName}
                          size="sm"
                          />

                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {emp.firstName} {emp.lastName}
                              </p>
                              <p className="text-xs text-slate-400">
                                ID: {emp.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-slate-500 text-sm">
                          {emp.email || '—'}
                        </TableCell>

                        {/* Department */}
                        <TableCell>
                          <span className="text-sm text-slate-700">
                            {emp.department || '—'}
                          </span>
                        </TableCell>

                        {/* Position */}
                        <TableCell className="text-slate-600 text-sm">
                          {emp.position || '—'}
                        </TableCell>

                        {/* Salary */}
                        <TableCell className="font-semibold text-slate-900">
                          {formatSalary(emp.baseSalary)}
                        </TableCell>

                        {/* Hire Date */}
                        <TableCell className="text-slate-500 text-sm">
                          {formatDate(emp.hireDate)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <ActiveBadge isActive={emp.isActive} />
                        </TableCell>

                        {/* Action */}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1.5"
                            onClick={() => handleEditClick({
                              id:         emp.id,
                              firstName:  emp.firstName,
                              lastName:   emp.lastName,
                              department: emp.department,
                              position:   emp.position,
                              baseSalary: emp.baseSalary,
                            })}
                          >
                            <Pencil size={12} /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <UserCheck size={20} className="text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm">No employees yet.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOnboardOpen(true)}
                          >
                            <Plus size={14} className="mr-2" /> Add your first employee
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <OnboardEmployeeModal
        open={onboardOpen}
        onOpenChange={setOnboardOpen}
      />

      <UpdateEmployeeModal
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        employee={selectedEmp}
      />
    </div>
  );
}