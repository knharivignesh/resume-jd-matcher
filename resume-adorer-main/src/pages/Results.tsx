import "./Result.css";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  LayoutTemplate,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ResumeData, useResumeContext } from "@/contexts/ResumeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateGallery, templates } from "@/components/TemplateGallery";
import { generateResume, pollUntilValue } from "@/services/resumeService";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MatchResults } from "@/components/MatchResults";
import { ResumeEditor } from "@/components/ResumeEditor";
import { toast } from "@/hooks/use-toast";

const Results = () => {
  const navigate = useNavigate();
  const {
    jobDescription,
    resumeFile,
    isLoading,
    setIsLoading,
    error,
    selectedTemplate,
    setSelectedTemplate,
  } = useResumeContext();

  const [resumeData, setResumeData] = useState(null);
  const [initialScore, setInitialScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [matchHighlights, setMatchHighlights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");

  useEffect(() => {
    // Redirect to upload page if no resume data
    if (!id) {
      navigate("/");
      return;
    }

    // Perform the match analysis
    const analyzeMatch = async () => {
      setIsAnalyzing(true);
      setIsLoading(true);

      try {
        const parsedResume = await pollUntilValue(id);
        setResumeData(parsedResume.rephrased_resume);
        setInitialScore(parsedResume.extracted_resume_ats_score);
        setFinalScore(parsedResume.rephrased_resume_ats_score);
        console.log("Extracted Value :", parsedResume.rephrased_resume);
      } catch (err) {
        console.error("Error analyzing match:", err);
        navigate("/");
        toast({
          title: "Error Analyzing Resume",
          description: `Please try after some time`,
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
        setIsLoading(false);
      }
    };

    analyzeMatch();
  }, []);

  const handleSaveChanges = (updatedData: ResumeData) => {
    setResumeData(updatedData);
    setActiveTab("match");
  };

  const toTab = (tab: string) => {
    console.log(tab);
    setActiveTab(tab);
  };

  const handleBackToUpload = () => {
    navigate("/");
  };

  const { id } = useParams();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Applied",
      description: `Your resume now uses the ${
        templates.find((t) => t.id === templateId)?.name
      } template`,
    });
  };

  const handleTemplateAction = async (action: string) => {
    if (action === "match") {
      setActiveTab(action);
    } else if (action === "download") {
      try {
        const response = await generateResume(id, selectedTemplate, resumeData);

        // Create Blob from the response data
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });

        // Create a temproary URL for the Blob
        const url = window.URL.createObjectURL(pdfBlob);

        // Create a temporary <a> element to trigger the download
        const tempLink = document.createElement("a");
        tempLink.href = url;
        // Set the desired filename for the downloaded file
        tempLink.setAttribute(
          "download",
          `resume_${selectedTemplate}.pdf`
        );

        // Append the <a> element to the body and click to trigger the download
        document.body.appendChild(tempLink);
        tempLink.click();

        // Cleanup the temporary element and URL
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading PDF: ", error);
      }
    }
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
              This may take a moment. We're extracting information from your
              resume and comparing it with the job description.
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
            <h1 className="text-3xl font-bold tracking-tight">
              Resume Analysis Complete
            </h1>
          </div>
          <p className="text-muted-foreground">
            Here are the results of your resume analysis. You can edit your
            information, select a template, and see how it matches the job
            description.
          </p>
        </div>
      </div>

      <Tabs defaultValue="resume" value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 ">
          <TabsTrigger value="resume" className="text-base py-3">
            Resume Information
          </TabsTrigger>
          <TabsTrigger value="match" className="text-base py-3">
            Job Match Analysis
          </TabsTrigger>
          <TabsTrigger value="template" className="text-base py-3">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="animate-fade-in">
          <ResumeEditor
            initialData={resumeData}
            onSave={handleSaveChanges}
            selectedTemplate={selectedTemplate}
          />
        </TabsContent>

        <TabsContent value="match" className="animate-fade-in">
          <MatchResults
            initialScore={initialScore}
            finalScore={finalScore}
            onButtonClick={toTab}
            highlights={matchHighlights}
          />
        </TabsContent>

        <TabsContent value="template" className="animate-fade-in">
          <TemplateGallery
            selectedTemplate={selectedTemplate}
            onButtonClick={handleTemplateAction}
            onSelectTemplate={handleSelectTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
