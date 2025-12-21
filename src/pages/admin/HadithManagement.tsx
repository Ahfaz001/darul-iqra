import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, BookOpen, Plus, Star } from 'lucide-react';

const sampleHadiths = [
  {
    id: 1,
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions.',
    narrator: 'Umar ibn Al-Khattab (RA)',
    source: 'Sahih Bukhari',
    number: '1'
  },
  {
    id: 2,
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih Bukhari',
    number: '6018'
  },
  {
    id: 3,
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sahih Bukhari',
    number: '13'
  }
];

const HadithManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Hadith Management | Dar-ul-Ulum</title>
        <meta name="description" content="Manage daily Hadith content" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <header className="bg-white border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h1 className="font-display font-bold text-primary text-lg">
                    Hadith Management
                  </h1>
                  <p className="text-xs text-muted-foreground">Manage daily Hadith content</p>
                </div>
              </div>
              
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Hadith
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-primary/10 to-emerald-100 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Today's Featured Hadith</h3>
                </div>
                <p className="text-2xl font-arabic text-foreground mb-2 text-right leading-relaxed">
                  {sampleHadiths[0].arabic}
                </p>
                <p className="text-muted-foreground italic mb-2">"{sampleHadiths[0].translation}"</p>
                <p className="text-sm text-primary">
                  — {sampleHadiths[0].narrator} | {sampleHadiths[0].source}, Hadith {sampleHadiths[0].number}
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            All Hadiths
          </h2>

          <div className="grid gap-4">
            {sampleHadiths.map((hadith) => (
              <Card key={hadith.id} className="bg-white border-border/30 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-xl font-arabic text-foreground mb-3 text-right leading-relaxed">
                    {hadith.arabic}
                  </p>
                  <p className="text-muted-foreground italic mb-3">"{hadith.translation}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                        {hadith.source}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Hadith #{hadith.number}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Narrator: {hadith.narrator}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Coming Soon</CardTitle>
              <CardDescription className="text-amber-700">
                Full Hadith management with database integration is coming soon. 
                You'll be able to add, edit, and schedule daily Hadiths for students.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    </>
  );
};

export default HadithManagement;
