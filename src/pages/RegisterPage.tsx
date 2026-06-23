import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { FileUp, ShieldCheck, FileText, Landmark } from 'lucide-react';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('role') || 'student';
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  // Student Form State
  const [studentForm, setStudentForm] = React.useState({
    name: '',
    email: '',
    password: '',
    university: '',
    studentId: '',
    refereeEmail: ''
  });

  // Company Form State
  const [companyForm, setCompanyForm] = React.useState({
    name: '',
    email: '',
    password: '',
    registrationNo: '',
    tin: '',
    address: '',
    description: '',
    paymentTerms: 'stipend' // stipend or none
  });

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = getFromStorage(STORAGE_KEYS.USERS, []);
      if (users.find((u: any) => u.email === studentForm.email)) {
        toast.error('Email already registered');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        ...studentForm,
        role: 'student',
        status: 'active'
      };

      users.push(newUser);
      setToStorage(STORAGE_KEYS.USERS, users);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      setLoading(false);
    }, 1000);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = getFromStorage(STORAGE_KEYS.USERS, []);
      const orgs = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, []);

      if (users.find((u: any) => u.email === companyForm.email)) {
        toast.error('Email already registered');
        setLoading(false);
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: companyForm.name,
        email: companyForm.email,
        password: companyForm.password,
        role: 'company',
        status: 'pending_verification'
      };

      const newOrg = {
        id: `org-${Date.now()}`,
        userId: newUser.id,
        ...companyForm,
        status: 'pending' // pending, approved, rejected
      };

      users.push(newUser);
      orgs.push(newOrg);
      
      setToStorage(STORAGE_KEYS.USERS, users);
      setToStorage(STORAGE_KEYS.ORGANIZATIONS, orgs);
      
      toast.success('Registration submitted! An admin will verify your documents shortly.');
      navigate('/login');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/3c3a1026-5325-49a1-98f3-b60e77847539/system-logo-985ac64e-1782237182537.webp" className="h-10 w-10 object-contain" alt="Logo" />
            <span className="font-bold text-2xl text-primary">IT Placement</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="text-muted-foreground">Select your role to get started with the platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="student" className="text-base">Student</TabsTrigger>
            <TabsTrigger value="company" className="text-base">Company / Org</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Registration</CardTitle>
                <CardDescription>Join as an IT student looking for internship placements</CardDescription>
              </CardHeader>
              <form onSubmit={handleStudentSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-name">Full Legal Name</Label>
                      <Input 
                        id="s-name" 
                        required 
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-email">University Email</Label>
                      <Input 
                        id="s-email" 
                        type="email" 
                        required 
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-id">Student ID / Registration No.</Label>
                      <Input 
                        id="s-id" 
                        required 
                        value={studentForm.studentId}
                        onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-uni">University / Institution</Label>
                      <Input 
                        id="s-uni" 
                        required 
                        value={studentForm.university}
                        onChange={(e) => setStudentForm({...studentForm, university: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-referee">Academic Referee Email (Lecturer)</Label>
                    <Input 
                      id="s-referee" 
                      type="email" 
                      placeholder="lecturer@university.edu"
                      required 
                      value={studentForm.refereeEmail}
                      onChange={(e) => setStudentForm({...studentForm, refereeEmail: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">We will send a verification token to this lecturer.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-pass">Password</Label>
                    <Input 
                      id="s-pass" 
                      type="password" 
                      required 
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Student Account'}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Organization Registration</CardTitle>
                <CardDescription>Register your company to post IT field opportunities</CardDescription>
              </CardHeader>
              <form onSubmit={handleCompanySubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="c-name">Company Name</Label>
                        <Input 
                          id="c-name" 
                          required 
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="c-email">Official Email</Label>
                        <Input 
                          id="c-email" 
                          type="email" 
                          required 
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-desc">Company Description</Label>
                      <Textarea 
                        id="c-desc" 
                        placeholder="Tell us about your organization..."
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" /> Security & Compliance
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="c-reg">Gov Registration Number</Label>
                        <Input 
                          id="c-reg" 
                          placeholder="e.g. BRELA-12345"
                          required 
                          value={companyForm.registrationNo}
                          onChange={(e) => setCompanyForm({...companyForm, registrationNo: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="c-tin">TIN Number</Label>
                        <Input 
                          id="c-tin" 
                          placeholder="9 digits"
                          required 
                          value={companyForm.tin}
                          onChange={(e) => setCompanyForm({...companyForm, tin: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="border rounded-md p-4 bg-muted/20">
                      <Label className="block mb-2">Upload Required Documents (ZIP/PDF)</Label>
                      <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 bg-white hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="text-center">
                          <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <span className="text-sm font-medium">Click to upload certificates</span>
                          <p className="text-xs text-muted-foreground mt-1">Registration, Tax Compliance, Permits</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-primary" /> Financial Clarity
                    </h3>
                    <div className="space-y-2">
                      <Label>Placement Condition</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${companyForm.paymentTerms === 'stipend' ? 'border-primary bg-accent' : ''}`}
                          onClick={() => setCompanyForm({...companyForm, paymentTerms: 'stipend'})}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${companyForm.paymentTerms === 'stipend' ? 'border-primary' : 'border-muted-foreground'}`}>
                            {companyForm.paymentTerms === 'stipend' && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <span className="text-sm font-medium">Stipend/Paid</span>
                        </div>
                        <div 
                          className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${companyForm.paymentTerms === 'none' ? 'border-primary bg-accent' : ''}`}
                          onClick={() => setCompanyForm({...companyForm, paymentTerms: 'none'})}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${companyForm.paymentTerms === 'none' ? 'border-primary' : 'border-muted-foreground'}`}>
                            {companyForm.paymentTerms === 'none' && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <span className="text-sm font-medium">Unpaid</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Note: Charging students fees for placement is strictly prohibited.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-pass">Account Password</Label>
                      <Input 
                        id="c-pass" 
                        type="password" 
                        required 
                        value={companyForm.password}
                        onChange={(e) => setCompanyForm({...companyForm, password: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Submitting registration...' : 'Register Organization'}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegisterPage;
