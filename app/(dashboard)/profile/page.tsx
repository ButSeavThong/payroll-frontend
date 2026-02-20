'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/src/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Edit, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatSalary, formatDate } from '@/src/lib/utils';

interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  baseSalary: number;
  hireDate: string;
  isActive: boolean;
}

export default function ProfilePage() {
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const role = useAppSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/employees/me');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600">No employee profile found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">My Profile</h1>
        {role === 'EMPLOYEE' && (
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                First Name
              </label>
              <p className="text-lg font-semibold">{employee.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Last Name
              </label>
              <p className="text-lg font-semibold">{employee.lastName}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <p className="text-lg font-semibold">{employee.email || 'N/A'}</p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-slate-900 mb-4">Employment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Department</p>
                  <p className="font-semibold">{employee.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Position</p>
                  <p className="font-semibold">{employee.position}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Base Salary</p>
                  <p className="font-semibold">{formatSalary(employee.baseSalary)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Hire Date</p>
                  <p className="font-semibold">{formatDate(employee.hireDate)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-600 mb-2">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                employee.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {role === 'EMPLOYEE' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-700">
              To update your profile information, please contact your HR administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
