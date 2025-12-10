import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User2, Mail, Phone, Building2, Calendar, MapPin, Clock, UserCheck } from 'lucide-react'
import { Profile } from '../api/interface';


interface StudentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
}

export default function StudentViewDialog({ open, onOpenChange, profile }: StudentViewDialogProps) {
  if (!profile) return null;

  const studentInfo = profile.students[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Student Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(profile.status)} px-3 py-1 text-sm font-medium capitalize`}>
              {profile.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Registered: {formatDate(profile.created_at)}
            </span>
          </div>

          <Separator />

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User2 className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-base">{profile.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                <p className="text-base">{studentInfo?.student_id || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="text-base">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Mobile Number
                </label>
                <p className="text-base">{profile.mobileNo}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address
                </label>
                <p className="text-base">{studentInfo?.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {studentInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                OJT Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Company
                  </label>
                  <p className="text-base">{studentInfo.company}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <UserCheck className="h-4 w-4" />
                    Supervisor
                  </label>
                  <p className="text-base">{studentInfo.supervisor}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration
                  </label>
                  <p className="text-base">{studentInfo.duration}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Started
                  </label>
                  <p className="text-base">{formatDate(studentInfo.created_at)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Account Type */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Account Type</span>
              <Badge variant="outline" className="capitalize">
                {profile.user_type}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}