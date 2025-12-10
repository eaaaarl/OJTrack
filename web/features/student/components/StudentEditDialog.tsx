import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { Profile } from '../api/interface'

interface StudentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  isLoading?: boolean;
  onSubmit?: (data: StudentEditFormData, profileId: string, studentId: string) => Promise<void> | void;
}

export interface StudentEditFormData {
  name: string;
  email: string;
  mobileNo: string;
  status: string;
  student_id: string;
  address: string;
  company: string;
  supervisor: string;
  duration: string;
}

export default function StudentEditDialog({ open, onOpenChange, profile, isLoading = false, onSubmit }: StudentEditDialogProps) {
  // Derive initial form data from profile
  const getInitialFormData = (): StudentEditFormData => {
    if (profile) {
      const studentInfo = profile.students[0];
      return {
        name: profile.name || '',
        email: profile.email || '',
        mobileNo: profile.mobileNo || '',
        status: profile.status || 'active',
        student_id: studentInfo?.student_id || '',
        address: studentInfo?.address || '',
        company: studentInfo?.company || '',
        supervisor: studentInfo?.supervisor || '',
        duration: studentInfo?.duration || ''
      };
    }
    return {
      name: '',
      email: '',
      mobileNo: '',
      status: 'active',
      student_id: '',
      address: '',
      company: '',
      supervisor: '',
      duration: ''
    };
  };

  const [formData, setFormData] = useState<StudentEditFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Partial<StudentEditFormData>>({});

  // Reset form when dialog opens with new profile
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleInputChange = (field: keyof StudentEditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentEditFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.supervisor.trim()) newErrors.supervisor = 'Supervisor is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!profile) return;

    // Console log the edited data
    console.log('=== STUDENT EDIT DATA ===');
    console.log('Profile ID:', profile.id);
    console.log('Student Record ID:', profile.students[0]?.id);
    console.log('Form Data:', formData);
    console.log('========================');

    // Call the onSubmit callback if provided
    if (onSubmit) {
      await onSubmit(formData, profile.id, profile.students[0]?.id);
    }

    // Don't close here - let the parent component close after mutation succeeds
  };

  const handleCancel = () => {
    if (isLoading) return; // Prevent closing while loading
    setErrors({});
    onOpenChange(false);
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => isLoading && e.preventDefault()}>
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Saving changes...</p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Student Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_id">
                  Student ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  placeholder="Enter student ID"
                  className={errors.student_id ? 'border-red-500' : ''}
                />
                {errors.student_id && <p className="text-xs text-red-500">{errors.student_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNo">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobileNo"
                  value={formData.mobileNo}
                  onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                  placeholder="Enter mobile number"
                  className={errors.mobileNo ? 'border-red-500' : ''}
                />
                {errors.mobileNo && <p className="text-xs text-red-500">{errors.mobileNo}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={2}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* OJT Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">OJT Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter company name"
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">
                  Supervisor <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  placeholder="Enter supervisor name"
                  className={errors.supervisor ? 'border-red-500' : ''}
                />
                {errors.supervisor && <p className="text-xs text-red-500">{errors.supervisor}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 6 months, 500 hours"
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}