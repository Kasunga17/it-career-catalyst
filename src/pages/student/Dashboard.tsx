import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { toast } from 'sonner';
import { Briefcase, CheckCircle2, Clock, Mail, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const auth = getFromStorage(STORAGE_KEYS.AUTH, null);
  const applications = getFromStorage(STORAGE_KEYS.APPLICATIONS, []).filter((app: any) => app.studentId === auth?.id);
  const referees = getFromStorage(STORAGE_KEYS.REFEREES, []).filter((ref: any) => ref.studentId === auth?.id);
  
  const refereeStatus = referees[0]?.status || 'pending'; // Simulating single referee for now

  const statusColors = {
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-destructive',
    reviewing: 'bg-primary'
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {auth?.name}</h1>
        <p className="text-muted-foreground text-lg">Track your internship applications and academic verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-80">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{applications.length}</div>
            <p className="text-xs mt-2 opacity-80">Submitted this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Referee Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[refereeStatus as keyof typeof statusColors]}>
                {refereeStatus.toUpperCase()}
              </Badge>
              <span className="text-sm text-slate-600">{auth?.refereeEmail}</span>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">Academic verification required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-xs mb-1">
              <span>85% complete</span>
            </div>
            <Progress value={85} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" /> My Applications
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Browse More</Link>
            </Button>
          </div>

          {applications.length === 0 ? (
            <Card className="border-dashed flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No applications yet</CardTitle>
              <CardDescription className="mb-6">Start applying to field opportunities to see them here.</CardDescription>
              <Button asChild><Link to="/">Explore Opportunities</Link></Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <Card key={app.id} className="hover:shadow-sm transition-shadow">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted h-12 w-12 rounded flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{app.opportunityTitle}</h4>
                        <p className="text-sm text-muted-foreground">{app.companyName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${statusColors[app.status as keyof typeof statusColors]} mb-1`}>
                        {app.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">Applied on {app.appliedAt}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Referee Status Sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" /> Academic Referee
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${refereeStatus === 'approved' ? 'bg-success/10' : 'bg-warning/10'}`}>
                  {refereeStatus === 'approved' ? (
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  ) : (
                    <Clock className="h-10 w-10 text-warning" />
                  )}
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{auth?.refereeEmail}</h4>
                <p className="text-sm text-muted-foreground mb-6">Assigned Academic Referee</p>
                
                {refereeStatus === 'pending' && (
                  <div className="bg-warning/10 border border-warning/20 rounded-md p-3 mb-6 flex gap-3 text-left">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                    <p className="text-xs text-warning-foreground font-medium">
                      Verification link was sent. Your application won't be visible to companies until approved.
                    </p>
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={() => {
                  toast.success('Resent verification link to lecturer.');
                }}>
                  Resend Link
                </Button>
                
                <p className="text-[10px] text-muted-foreground mt-4 italic">
                  * Lecturer will receive a questionnaire token to verify your academic standing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
