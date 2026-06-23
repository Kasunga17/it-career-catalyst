import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2, 
  FileCheck, 
  PlusCircle,
  Menu,
  X,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '@/lib/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  const auth = getFromStorage(STORAGE_KEYS.AUTH, null);
  
  if (!auth && location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
    React.useEffect(() => {
      navigate('/login');
    }, []);
    return null;
  }

  const handleLogout = () => {
    setToStorage(STORAGE_KEYS.AUTH, null);
    navigate('/login');
  };

  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { name: 'User Management', icon: Users, path: '/admin/users' },
      { name: 'Organizations', icon: Building2, path: '/admin/organizations' },
      { name: 'Reset Requests', icon: FileCheck, path: '/admin/resets' },
    ],
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
      { name: 'Browse Jobs', icon: Search, path: '/' },
      { name: 'My Applications', icon: Briefcase, path: '/student/applications' },
    ],
    company: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/company/dashboard' },
      { name: 'Post Job', icon: PlusCircle, path: '/company/post' },
      { name: 'Applicants', icon: Users, path: '/company/applicants' },
    ]
  };

  const currentRole = auth?.role || 'public';
  const roleMenu = menuItems[currentRole as keyof typeof menuItems] || [];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  if (isAuthPage && !auth) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 mx-auto">
            <Link to="/" className="flex items-center gap-2">
              <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/3c3a1026-5325-49a1-98f3-b60e77847539/system-logo-985ac64e-1782237182537.webp" className="h-8 w-8 object-contain" alt="Logo" />
              <span className="font-bold text-xl text-primary">IT Placement</span>
            </Link>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-muted/50 py-8">
          <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} IT Career Placement System. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary hidden sm:inline-block">IT Placement</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    {auth?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-xs">
                  <span className="font-semibold">{auth?.name}</span>
                  <span className="text-muted-foreground capitalize">{auth?.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 border-r bg-white hidden md:block overflow-y-auto">
            <nav className="p-4 space-y-2">
              {roleMenu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'hover:bg-accent text-slate-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
