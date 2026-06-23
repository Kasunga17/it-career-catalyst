import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { PlusCircle, Users, Briefcase, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const auth = getFromStorage(STORAGE_KEYS.AUTH, null);
  const org = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, []).find((o: any) => o.userId === auth?.id);
  const myOpportunities = getFromStorage(STORAGE_KEYS.OPPORTUNITIES, []).filter((op: any) => op.userId === auth?.id);
  const allApplications = getFromStorage(STORAGE_KEYS.APPLICATIONS, []);
  
  // Get applications for my opportunities
  const myApplications = allApplications.filter((app: any) => 
    myOpportunities.some((op: any) => op.id === app.opportunityId)
  );

  const pendingApps = myApplications.filter((app: any) => app.status === 'pending');

  const handleApprove = (appId: string) => {
    const apps = getFromStorage(STORAGE_KEYS.APPLICATIONS, []);
    const updated = apps.map((app: any) => app.id === appId ? { ...app, status: 'approved' } : app);
    setToStorage(STORAGE_KEYS.APPLICATIONS, updated);
    toast.success('Application approved!');
  };

  const handleReject = (appId: string) => {
    const apps = getFromStorage(STORAGE_KEYS.APPLICATIONS, []);
    const updated = apps.map((app: any) => app.id === appId ? { ...app, status: 'rejected' } : app);
    setToStorage(STORAGE_KEYS.APPLICATIONS, updated);
    toast.error('Application rejected.');
  };

  if (org?.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-warning/10 h-20 w-20 rounded-full flex items-center justify-center mb-6">
          <Clock className="h-10 w-10 text-warning" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Verification Pending</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Thank you for registering. Our administrators are currently reviewing your government certificates and tax documents. 
          You will be notified once your account is approved.
        </p>
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-sm font-medium">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-left">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <span>We verify your BRELA/Registration number</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <span>We audit your tax compliance status (TIN)</span>
            </div>
            <div className="flex gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 shrink-0" />
              <span>Full dashboard access granted</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{org?.name}</h1>
          <p className="text-muted-foreground">Corporate Workstation - Manage your IT placements.</p>
        </div>
        <Button className="w-full md:w-auto" asChild>
          <Link to="/company/post">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Opportunity
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Active Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myOpportunities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{pendingApps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Approved Talent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {myApplications.filter((a: any) => a.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Incoming Applications
          </h2>
          
          {pendingApps.length === 0 ? (
            <Card className="border-dashed py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>No pending applications</CardTitle>
              <CardDescription>All incoming student applications have been processed.</CardDescription>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApps.map((app: any) => (
                <Card key={app.id}>
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="bg-primary/10 h-12 w-12 rounded flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{app.studentName}</h4>
                        <p className="text-sm text-slate-600">Applying for: {app.opportunityTitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] h-5">ID: {app.studentId}</Badge>
                          <span className="text-xs text-muted-foreground italic">Academic Verification: Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleApprove(app.id)} className="border-success text-success hover:bg-success/10">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReject(app.id)} className="border-destructive text-destructive hover:bg-destructive/10">
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Postings Sidebar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" /> Active Postings
          </h2>
          {myOpportunities.map((op: any) => (
            <Card key={op.id}>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{op.title}</CardTitle>
                <CardDescription className="text-xs">Expires: {op.deadline}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-muted-foreground">{op.applications || 0} applicants</span>
                  <Badge variant={op.status === 'active' ? 'default' : 'secondary'} className="h-5 text-[10px]">
                    {op.status || 'Active'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t flex justify-end">
                <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
                  View Details <FileText className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
