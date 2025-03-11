
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
  onDescriptionChange: (description: string) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ 
  onDescriptionChange 
}) => {
  const [description, setDescription] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    onDescriptionChange(newValue);
  };

  return (
    <Card className="w-full p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <Label htmlFor="job-description" className="text-lg font-medium">
          Job Description
        </Label>
      </div>
      
      <Textarea
        id="job-description"
        value={description}
        onChange={handleChange}
        placeholder="Paste the job description here to match it with your resume..."
        className="min-h-[200px] resize-y focus-ring transition-shadow duration-300"
      />
      
      <div className="mt-2 text-sm text-muted-foreground">
        <p>Add detailed job requirements to get better results.</p>
      </div>
    </Card>
  );
};
