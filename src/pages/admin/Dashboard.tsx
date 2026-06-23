import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { Building2, ShieldCheck, Users, FileText, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const organizations = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, []);
  
  const pendingOrgs = organizations.filter((o: any) => o.status === 'pending');
  const students = users.filter((u: any) => u.role === 'student');
  const companies = users.filter((u: any) => u.role === 'company');

  const handleApproveOrg = (orgId: string) => {
    const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, []);
    const updatedOrgs = orgs.map((o: any) => o.id === orgId ? { ...o, status: 'approved' } : o);
    setToStorage(STORAGE_KEYS.ORGANIZATIONS, updatedOrgs);
    
    // Also update the user status
    const targetOrg = updatedOrgs.find((o: any) => o.id === orgId);
    const updatedUsers = users.map((u: any) => u.id === targetOrg.userId ? { ...u, status: 'active' } : u);
    setToStorage(STORAGE_KEYS.USERS, updatedUsers);
    
    toast.success('Organization approved successfully!');
  };

  const handleRejectOrg = (orgId: string) => {
    const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, []);
    const updatedOrgs = orgs.map((o: any) => o.id === orgId ? { ...o, status: 'rejected' } : o);
    setToStorage(STORAGE_KEYS.ORGANIZATIONS, updatedOrgs);
    toast.error('Organization application rejected.');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Administrator Desk</h1>
        <p className="text-muted-foreground">Monitor platform growth and audit corporate compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pending Orgs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{pendingOrgs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Active Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {getFromStorage(STORAGE_KEYS.OPPORTUNITIES, []).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{students.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="auditing" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="auditing">Corporate Auditing</TabsTrigger>
          <TabsTrigger value="users">User Access</TabsTrigger>
          <TabsTrigger value="reports">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="auditing" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Verification Desk
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search TIN or Name..." className="pl-9 h-9" />
            </div>
          </div>

          {pendingOrgs.length === 0 ? (
            <Card className="border-dashed py-12 text-center bg-white">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>No pending verifications</CardTitle>
              <CardDescription>All corporate entities have been audited.</CardDescription>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {pendingOrgs.map((org: any) => (
                <Card key={org.id} className="overflow-hidden border-warning/30">
                  <div className="bg-warning/5 border-b border-warning/10 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-xs font-bold text-warning-foreground uppercase tracking-wider">Pending Audit</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Submitted: Today</span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-xs">
                      <span><strong>REG:</strong> {org.registrationNo}</span>
                      <span><strong>TIN:</strong> {org.tin}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-2">{org.description}</p>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Uploaded Documents
                      </h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-white cursor-pointer hover:bg-accent">BRELA_Cert.pdf</Badge>
                        <Badge variant="outline" className="bg-white cursor-pointer hover:bg-accent">TIN_Compliance.pdf</Badge>
                        <Badge variant="outline" className="bg-white cursor-pointer hover:bg-accent">Permit_2024.pdf</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <strong>Payment Terms:</strong>
                      <Badge className={org.paymentTerms === 'stipend' ? 'bg-success' : 'bg-muted text-muted-foreground'}>
                        {org.paymentTerms === 'stipend' ? 'Paid / Stipend Provided' : 'Unpaid Placement'}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-4 flex gap-3">
                    <Button className="flex-1 bg-success hover:bg-success/90" onClick={() => handleApproveOrg(org.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Entity
                    </Button>
                    <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleRejectOrg(org.id)}>
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Platform Users</CardTitle>
              <CardDescription>Manage all students and corporate representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3 capitalize">{u.role}</td>
                        <td className="p-3">
                          <Badge variant={u.status === 'active' ? 'default' : 'secondary'}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
