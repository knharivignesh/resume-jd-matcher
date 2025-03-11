
import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  maxSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size should not exceed ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with extension: ${acceptedFileTypes.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [acceptedFileTypes, maxSizeMB, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelected(file);
    }
  }, [onFileSelected, validateFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelected(file);
      }
    }
  }, [onFileSelected, validateFile]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card className={cn(
      "w-full h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300",
      isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-200",
      selectedFile ? "border-green-500 bg-green-50/50" : ""
    )}>
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="w-full h-full flex flex-col items-center justify-center gap-4 animate-fade-in"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(',')}
          className="hidden"
        />
        
        {selectedFile ? (
          <>
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full animate-scale-in">
              <FileType className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-center animate-slide-up">
              <p className="font-semibold text-lg">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleButtonClick}
                className="mt-2 text-primary hover:text-primary/80 focus-ring"
              >
                Choose a different file
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Drag & Drop your resume here</p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files (PDF, DOC, DOCX)
              </p>
              <Button 
                onClick={handleButtonClick}
                className="focus-ring"
              >
                Select File
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
