import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { Profile } from '../api/interface';


interface StudentRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  isLoading?: boolean;
  onConfirm?: (profileId: string, studentProfileId: string, attendanceIds: string[]) => Promise<void> | void;
}

export default function StudentRestoreDialog({
  open,
  onOpenChange,
  profile,
  isLoading = false,
  onConfirm
}: StudentRestoreDialogProps) {
  const handleConfirm = async () => {
    if (!profile || !onConfirm) return;

    const studentInfo = profile.students[0];
    const attendanceIds = profile?.attendances?.map(a => a.id) || [];

    console.log('=== STUDENT RESTORE DATA ===');
    console.log('Profile ID:', profile.id);
    console.log('Student Profile ID:', studentInfo?.id);
    console.log('Attendance IDs:', attendanceIds);
    console.log('Total Attendances:', attendanceIds.length);
    console.log('========================');

    await onConfirm(profile.id, studentInfo?.id, attendanceIds);
  };

  const handleCancel = () => {
    if (isLoading) return;
    onOpenChange(false);
  };

  if (!profile) return null;

  const studentInfo = profile.students[0];

  // Calculate days until permanent deletion
  const deletedDate = profile.deleted_at ? new Date(profile.deleted_at) : null;
  const daysRemaining = deletedDate
    // eslint-disable-next-line react-hooks/purity
    ? Math.max(0, 30 - Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <AlertDialogContent className="max-w-md">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Restoring...</p>
            </div>
          </div>
        )}

        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-green-100 p-2">
              <RefreshCw className="h-5 w-5 text-green-600" />
            </div>
            <AlertDialogTitle className="text-xl">Restore Student</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-3">
            <p>
              Are you sure you want to restore <span className="font-semibold text-foreground">{profile.name}</span>?
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
              {profile.deleted_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deleted on:</span>
                  <span className="font-medium text-foreground">
                    {formatDate(profile.deleted_at)}
                  </span>
                </div>
              )}
            </div>
            <div className={`${daysRemaining <= 7 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3 space-y-1`}>
              <p className={`text-sm font-medium ${daysRemaining <= 7 ? 'text-red-800' : 'text-blue-800'}`}>
                {daysRemaining <= 7 ? '⚠️ Urgent' : 'ℹ️ Information'}
              </p>
              <p className={`text-xs ${daysRemaining <= 7 ? 'text-red-700' : 'text-blue-700'}`}>
                {daysRemaining > 0
                  ? `This student will be permanently deleted in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Restoring will reactivate their account and all associated data.`
                  : 'This student is scheduled for permanent deletion. Restore immediately to prevent data loss.'}
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
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Restoring...' : 'Restore Student'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}