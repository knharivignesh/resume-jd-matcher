
import React, { useEffect, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ResumeEditor } from '@/components/ResumeEditor';
import { MatchResults } from '@/components/MatchResults';
import { TemplateGallery, templates } from '@/components/TemplateGallery';
import { ResumeData, useResumeContext } from '@/contexts/ResumeContext';
import { matchResumeWithJob, parseResume, pollUntilValue } from '@/services/resumeService';
import { ArrowLeft, FileText, CheckCircle2, LayoutTemplate } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Results = () => {
  const navigate = useNavigate();
  const { 
    jobDescription, 
    isLoading, 
    setIsLoading, 
    error,
    selectedTemplate,
    setSelectedTemplate
  } = useResumeContext();
  let [resumeData, setResumeData] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [matchHighlights, setMatchHighlights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  const { id } = useParams();

  useEffect(() => {
    // Redirect to upload page if no resume data
    if (!id) {
      navigate('/');
      return;
    }

    // Perform the match analysis
    const analyzeMatch = async () => {
      setIsAnalyzing(true);
      setIsLoading(true);

      try {
        const parsedResume = await pollUntilValue(id);
        setResumeData(parsedResume);
        console.log("Extracted Value :", parsedResume);
      } catch (err) {
      const parsedResume = await parseResume();
      // Update context
      setResumeData(parsedResume);
        console.error('Error analyzing match:', err);
      } finally {
        const matchResult = await matchResumeWithJob(resumeData, jobDescription);
        setMatchScore(matchResult.matchScore);
        setMatchHighlights(matchResult.highlights);
        setIsAnalyzing(false);
        setIsLoading(false);
        toast({
          title: "Error Analyzing Resume",
          description: `Please try after some time`,
          variant: "destructive",
        });
      }
    };

    analyzeMatch();
  }, []);

  const handleSaveChanges = (updatedData: any) => {
    setResumeData(updatedData);
  };

  const handleBackToUpload = () => {
    navigate('/');
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Applied",
      description: `Your resume now uses the ${templates.find(t => t.id === templateId)?.name} template`,
    });
  };

  // Show loading state or error
  if (isLoading || !resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 glass-morphism animate-pulse-soft">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary/60" />
            </div>
            <h2 className="text-xl font-semibold">Analyzing Your Resume</h2>
            <p className="text-center text-muted-foreground">
              This may take a moment. We're extracting information from your resume and comparing it with the job description.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Processing Error</h2>
            <p className="text-center">{error}</p>
            <Button onClick={handleBackToUpload}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 animate-slide-down">
        <Button 
          variant="ghost" 
          onClick={handleBackToUpload}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Upload
        </Button>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h1 className="text-3xl font-bold tracking-tight">Resume Analysis Complete</h1>
          </div>
          <p className="text-muted-foreground">
            Here are the results of your resume analysis. You can edit your information, select a template, and see how it matches the job description.
          </p>
        </div>
      </div>

      <Tabs defaultValue="resume" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="resume" className="text-base py-3">Resume Information</TabsTrigger>
          <TabsTrigger value="template" className="text-base py-3">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="match" className="text-base py-3">Job Match Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume" className="animate-fade-in">
          <ResumeEditor initialData={resumeData} onSave={handleSaveChanges} selectedTemplate={selectedTemplate} />
        </TabsContent>
        
        <TabsContent value="template" className="animate-fade-in">
          <TemplateGallery 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={handleSelectTemplate} 
          />
        </TabsContent>
        
        <TabsContent value="match" className="animate-fade-in">
          <MatchResults matchScore={matchScore} highlights={matchHighlights} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
