import React from 'react';
import { Search, MapPin, Building2, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const opportunities = getFromStorage(STORAGE_KEYS.OPPORTUNITIES, []);
  const auth = getFromStorage(STORAGE_KEYS.AUTH, null);

  const filteredOpportunities = opportunities.filter((op: any) => 
    op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/3c3a1026-5325-49a1-98f3-b60e77847539/hero-students-2aab6649-1782237182170.webp" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Students" 
        />
        <div className="relative z-20 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bridge the Gap Between Academic and Career Success</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Manage, track, and audit IT internship and field study applications with ease and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/register">Join as a Student</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white text-white hover:bg-white/20" asChild>
              <Link to="/register?role=company">Partner with Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg -mt-20 relative z-30 p-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search by role, company, or skills..." 
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-12 px-8">Search Opportunities</Button>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Featured Placements</h2>
          <Badge variant="secondary" className="text-primary font-medium">
            {filteredOpportunities.length} opportunities available
          </Badge>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No placements found</h3>
            <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((op: any) => (
              <Card key={op.id} className="hover:shadow-md transition-shadow flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={op.type === 'paid' ? 'bg-success' : 'bg-warning'}>
                      {op.type === 'paid' ? 'Stipend Provided' : 'Unpaid Internship'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-1">{op.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> {op.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{op.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {op.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {op.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {op.deadline}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full group" asChild>
                    <Link to={auth ? `/student/apply/${op.id}` : '/login'}>
                      {auth ? 'Apply Now' : 'Login to Apply'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2 text-primary">500+</div>
            <div className="text-slate-400">Verified Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 text-success">2,500+</div>
            <div className="text-slate-400">Successful Placements</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2 text-warning">100%</div>
            <div className="text-slate-400">Academic Verification</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
