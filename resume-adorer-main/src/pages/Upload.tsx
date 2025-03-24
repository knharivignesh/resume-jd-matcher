import { ArrowRight, Briefcase, FileType } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { createJobID } from '@/services/resumeService';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '@/contexts/ResumeContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    setIsLoading, 
    setError 
  } = useResumeContext();
  
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Missing resume",
        description: "Please upload your resume file first.",
        variant: "destructive",
      });
      return;
    }

    // At least have a minimal job description
    if (description.trim().length < 10) {
      toast({
        title: "Job description too short",
        description: "Please provide a more detailed job description for better results.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);
    setError(null);
    try {
      const jobIdRes = await createJobID(file, description.trim());
      const jobId = jobIdRes.data.job_id;
      console.log("JOB_ID :", jobId);
      navigate(`/results/${jobId}`);
      return;
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Error connecting to server",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="space-y-2 text-center mb-12 animate-slide-down">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resume Analyzer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your resume and a job description to see how well they match and get improvement suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 mb-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileType className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Upload Your Resume</h2>
          </div>
          <FileUpload onFileSelected={handleFileSelected} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Enter Job Description</h2>
          </div>
          <JobDescriptionInput onDescriptionChange={handleDescriptionChange} />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Button 
          onClick={handleSubmit} 
          className="px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          disabled={isProcessing}
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              Analyze Resume <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Upload;
