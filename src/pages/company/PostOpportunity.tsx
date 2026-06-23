import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { ArrowLeft, Briefcase, Calendar, MapPin, DollarSign } from 'lucide-react';

const PostOpportunity = () => {
  const navigate = useNavigate();
  const auth = getFromStorage(STORAGE_KEYS.AUTH, null);
  const org = getFromStorage(STORAGE_KEYS.ORGANIZATIONS, []).find((o: any) => o.userId === auth?.id);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    location: '',
    type: 'unpaid',
    deadline: '',
    skills: '',
    stipendAmount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!org) {
      toast.error('Organization details not found.');
      return;
    }

    const opportunities = getFromStorage(STORAGE_KEYS.OPPORTUNITIES, []);
    const newOp = {
      id: Date.now().toString(),
      userId: auth.id,
      company: org.name,
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      appliedAt: new Date().toLocaleDateString(),
      status: 'active'
    };

    opportunities.push(newOp);
    setToStorage(STORAGE_KEYS.OPPORTUNITIES, opportunities);
    toast.success('Opportunity posted successfully!');
    navigate('/company/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post Field Opportunity</CardTitle>
          <CardDescription>Publish a new IT internship opening for students.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="title" 
                  placeholder="e.g. Junior Web Developer Intern" 
                  className="pl-10"
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Work Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    placeholder="e.g. Dar es Salaam" 
                    className="pl-10"
                    required 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="deadline" 
                    type="date"
                    className="pl-10"
                    required 
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Placement Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid Internship</SelectItem>
                  <SelectItem value="paid">Paid / Stipend Provided</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'paid' && (
              <div className="space-y-2">
                <Label htmlFor="stipend">Stipend Amount (Monthly)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="stipend" 
                    placeholder="e.g. 300,000 TZS" 
                    className="pl-10"
                    required 
                    value={formData.stipendAmount}
                    onChange={(e) => setFormData({...formData, stipendAmount: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (Comma separated)</Label>
              <Input 
                id="skills" 
                placeholder="React, PHP, SQL, Git" 
                required 
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description & Requirements</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="min-h-[150px]"
                required 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-12 text-lg" type="submit">Publish Placement</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostOpportunity;
