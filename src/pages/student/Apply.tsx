import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { ArrowLeft, CheckCircle2, Building2, MapPin, Calendar, FileText } from 'lucide-react';

const ApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getFromStorage(STORAGE_KEYS.AUTH, null);
  const opportunities = getFromStorage(STORAGE_KEYS.OPPORTUNITIES, []);
  const op = opportunities.find((o: any) => o.id === id);

  const [coverLetter, setCoverLetter] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const applications = getFromStorage(STORAGE_KEYS.APPLICATIONS, []);
      
      // Check if already applied
      if (applications.find((a: any) => a.studentId === auth.id && a.opportunityId === id)) {
        toast.error('You have already applied for this position.');
        setLoading(false);
        return;
      }

      const newApp = {
        id: Date.now().toString(),
        studentId: auth.id,
        studentName: auth.name,
        opportunityId: id,
        opportunityTitle: op.title,
        companyName: op.company,
        coverLetter,
        status: 'pending',
        appliedAt: new Date().toLocaleDateString()
      };

      applications.push(newApp);
      setToStorage(STORAGE_KEYS.APPLICATIONS, applications);
      toast.success('Application submitted successfully!');
      navigate('/student/dashboard');
      setLoading(false);
    }, 1000);
  };

  if (!op) return <div>Opportunity not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{op.title}</CardTitle>
              <CardDescription className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {op.company}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {op.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Apply by: {op.deadline}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <h4 className="text-slate-800 font-bold mb-2">Description</h4>
                <p className="text-slate-600 whitespace-pre-wrap mb-4">{op.description}</p>
                
                <h4 className="text-slate-800 font-bold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {op.skills.map((skill: string) => (
                    <span key={skill} className="px-2 py-1 bg-muted rounded-md text-xs font-medium">{skill}</span>
                  ))}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h4 className="text-primary font-bold mb-1">Financial Disclosure</h4>
                  <p className="text-sm text-slate-700">
                    {op.type === 'paid' 
                      ? `This organization provides a monthly stipend of ${op.stipendAmount}.` 
                      : 'This is an unpaid field study placement. No fees will be charged to the student.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Application</CardTitle>
              <CardDescription>Tell the company why you're a good fit for this role.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="letter">Cover Letter / Statement of Interest</Label>
                  <Textarea 
                    id="letter" 
                    placeholder="Write your cover letter here..." 
                    className="min-h-[200px]"
                    required 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                <div className="bg-muted/30 p-4 rounded-md flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Auto-attached Profile</p>
                    <p className="text-xs text-muted-foreground">Your student ID, university, and academic verification status will be automatically shared with the employer.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> Academic Standing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                Your referee (<strong>{auth?.refereeEmail}</strong>) has been notified. 
                Employers prioritize verified students.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">About {op.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                This organization is a verified corporate partner of the IT Career Placement System.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
