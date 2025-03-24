
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  LayoutTemplate, 
  CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define template types
export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  primaryColor: string;
  secondaryColor: string;
};

interface TemplateGalleryProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const templates: ResumeTemplate[] = [
  {
    id: "template_1",
    name: "Template 1",
    description: "Traditional resume style with a clean, professional look",
    icon: <FileText />,
    primaryColor: "bg-blue-600",
    secondaryColor: "bg-blue-100",
  },
  {
    id: "template_2",
    name: "Template 2",
    description: "Traditional resume style with a clean, professional look",
    icon: <FileText />,
    primaryColor: 'bg-blue-600',
    secondaryColor: 'bg-blue-100',
  },
  {
    id: "template_3",
    name: "Template 3",
    description: "Contemporary design with bold headings and clean sections",
    icon: <LayoutTemplate />,
    primaryColor: "bg-emerald-600",
    secondaryColor: "bg-emerald-100",
  },
  {
    id: "template_4",
    name: "Template 4",
    description: "Contemporary design with bold headings and clean sections",
    icon: <LayoutTemplate />,
    primaryColor: 'bg-emerald-600',
    secondaryColor: 'bg-emerald-100',
  },
  {
    id: "template_5",
    name: "Template 5",
    description: "Simple, elegant design focused on content",
    icon: <FileText />,
    primaryColor: "bg-slate-700",
    secondaryColor: "bg-slate-100",
  },
  {
    id: "template_6",
    name: "Template 6",
    description: "Simple, elegant design focused on content",
    icon: <FileText />,
    primaryColor: "bg-slate-700",
    secondaryColor: "bg-slate-100",
  }
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Resume Template</h2>
      <p className="text-muted-foreground">
        Select a template style for your resume
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "border-2 cursor-pointer transition-all duration-200 overflow-hidden",
              selectedTemplate === template.id
                ? "border-primary ring-2 ring-primary ring-opacity-50"
                : "border-transparent hover:border-gray-200"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="relative">
              {/* Template preview header */}
              <div className={cn("h-2", template.primaryColor)} />
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded", template.secondaryColor)}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                {/* Mini preview of the template */}
                <div className="mt-4 border rounded p-2 text-xs bg-background">
                  <div className={cn("h-2 w-24 mb-2 rounded", template.primaryColor)} />
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-gray-200 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
