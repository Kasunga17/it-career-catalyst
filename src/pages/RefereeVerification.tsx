import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

const RefereeVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const studentEmail = searchParams.get('email');
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    standing: 'excellent',
    comments: '',
    confirmed: false
  });

  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const referees = getFromStorage(STORAGE_KEYS.REFEREES, []);
    const students = getFromStorage(STORAGE_KEYS.USERS, []);
    const student = students.find((s: any) => s.email === studentEmail);

    if (student) {
      // Add or update referee record
      const existingIndex = referees.findIndex((r: any) => r.studentId === student.id);
      const refData = {
        id: Date.now().toString(),
        studentId: student.id,
        email: student.refereeEmail,
        status: 'approved',
        comments: form.comments,
        rating: form.standing,
        verifiedAt: new Date().toLocaleDateString()
      };

      if (existingIndex > -1) referees[existingIndex] = refData;
      else referees.push(refData);

      setToStorage(STORAGE_KEYS.REFEREES, referees);
      setSubmitted(true);
      toast.success('Verification submitted. Thank you for your feedback!');
    } else {
      toast.error('Student record not found.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center py-8">
          <CardContent>
            <div className="bg-success/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Complete</h1>
            <p className="text-muted-foreground mb-8">
              Your academic reference for <strong>{studentEmail}</strong> has been successfully recorded in the system.
            </p>
            <Button className="w-full" onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Academic Referee Verification</CardTitle>
          <CardDescription>
            You have been requested to provide an academic reference for a student's internship application.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-md border border-primary/10 flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Student Email</p>
                <p className="font-semibold text-slate-800">{studentEmail || 'student@university.edu'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Student's Academic Standing</Label>
              <RadioGroup value={form.standing} onValueChange={(val) => setForm({...form, standing: val})} className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent" className="flex-1 cursor-pointer">Excellent - Top of class</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good" className="flex-1 cursor-pointer">Good - Strong academic performance</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="average" id="average" />
                  <Label htmlFor="average" className="flex-1 cursor-pointer">Average - Satisfactory progress</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea 
                id="comments" 
                placeholder="Share any relevant details about the student's technical skills or work ethic..."
                value={form.comments}
                onChange={(e) => setForm({...form, comments: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="confirm" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
                checked={form.confirmed}
                onChange={(e) => setForm({...form, confirmed: e.target.checked})}
              />
              <Label htmlFor="confirm" className="text-sm text-slate-600 leading-tight">
                I confirm that this information is accurate to the best of my knowledge as an academic official.
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-12" type="submit" disabled={!form.confirmed}>
              Submit Verification
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RefereeVerification;
