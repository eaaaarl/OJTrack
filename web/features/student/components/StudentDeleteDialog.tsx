import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { Profile } from '../api/interface';

interface StudentDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  isLoading?: boolean;
  onConfirm?: (profileId: string, studentProfileId: string, studentAttendanceId: string[]) => Promise<void> | void;
}

export default function StudentDeleteDialog({
  open,
  onOpenChange,
  profile,
  isLoading = false,
  onConfirm
}: StudentDeleteDialogProps) {
  console.log('PROFILES', JSON.stringify(profile, null, 2))
  const handleConfirm = async () => {
    if (!profile || !onConfirm) return;

    const studentInfo = profile.students[0];

    // For now, we'll use the student profile ID as attendance ID
    // You should pass the actual attendance ID from your data
    const studentAttendanceIds = profile?.attendances?.map(a => a.id) || [];

    console.log('=== STUDENT DELETE DATA ===');
    console.log('Profile ID:', profile.id);
    console.log('Student Profile ID:', studentInfo?.id);
    console.log('Attendance IDs:', studentAttendanceIds);
    console.log('Total Attendances:', studentAttendanceIds.length);
    console.log('========================');

    await onConfirm(profile.id, studentInfo?.id, studentAttendanceIds);
  };

  const handleCancel = () => {
    if (isLoading) return; // Prevent closing while loading
    onOpenChange(false);
  };

  if (!profile) return null;

  const studentInfo = profile.students[0];

  return (
    <AlertDialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <AlertDialogContent className="max-w-md">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Deleting...</p>
            </div>
          </div>
        )}

        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl">Delete Student</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-3">
            <p>
              Are you sure you want to delete <span className="font-semibold text-foreground">{profile.name}</span>?
            </p>
            <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student ID:</span>
                <span className="font-medium text-foreground">{studentInfo?.student_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">{studentInfo?.company}</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ Important Information
              </p>
              <p className="text-xs text-yellow-700">
                This student will be marked as deleted and can be recovered within 30 days. After 30 days, all data will be permanently removed from the system.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Student'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}