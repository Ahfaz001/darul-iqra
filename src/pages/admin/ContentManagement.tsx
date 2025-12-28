import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, Upload, FileText, File, Image, Video, FolderOpen } from 'lucide-react';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

const contentCategories = [
  { name: 'PDFs & Documents', icon: FileText, count: 0, color: 'bg-red-100 text-red-600' },
  { name: 'Images', icon: Image, count: 0, color: 'bg-blue-100 text-blue-600' },
  { name: 'Videos', icon: Video, count: 0, color: 'bg-purple-100 text-purple-600' },
  { name: 'Other Files', icon: File, count: 0, color: 'bg-gray-100 text-gray-600' },
];

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Content Management | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="Upload and manage learning materials" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <AdminMobileNav />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="hidden md:flex mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="font-display font-bold text-primary text-sm sm:text-lg truncate">
                    Content Management
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Upload and manage materials</p>
                </div>
              </div>
              
              <Button className="bg-primary hover:bg-primary/90 shrink-0" size="sm">
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload Files</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Upload Area */}
          <Card className="bg-card border-border/30 mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-8">
              <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Drag and drop files here
                </h3>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                  or click to browse from your computer
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: PDF, DOC, DOCX, JPG, PNG, MP4 (max 50MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Content Categories</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {contentCategories.map((category) => (
              <Card key={category.name} className="bg-card border-border/30 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                    <category.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1 text-xs sm:text-sm">{category.name}</h3>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          <Card className="bg-card border-border/30">
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
              <FolderOpen className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">No Content Yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Start uploading learning materials like PDFs, documents, and videos 
                for your students to access.
              </p>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First File
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6 sm:mt-8 bg-amber-50 border-amber-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-amber-800 text-base sm:text-lg">Coming Soon</CardTitle>
              <CardDescription className="text-amber-700 text-sm">
                Full file upload and storage functionality is coming soon. 
                You'll be able to upload PDFs, documents, and videos for students.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ContentManagement;
