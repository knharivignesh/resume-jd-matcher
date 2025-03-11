import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { ResumeData } from '@/contexts/ResumeContext';
import { templates } from '@/components/TemplateGallery';
import { cn } from '@/lib/utils';

interface ResumeEditorProps {
  initialData: ResumeData;
  onSave: (data: ResumeData) => void;
  selectedTemplate: string;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ 
  initialData, 
  onSave,
  selectedTemplate,
}) => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  const template = templates.find(t => t.id === selectedTemplate) || templates[0];
  const { primaryColor, secondaryColor } = template;

  const updatePersonal = (field: string, value: string) => {
    setData({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  const updateSummary = (value: string) => {
    setData({
      ...data,
      summary: value
    });
  };

  const addItem = (section: keyof ResumeData) => {
    if (!Array.isArray(data[section])) return;
    
    const newItem = { id: Math.random().toString(36).substring(2, 10) };
    setData({
      ...data,
      [section]: [...(data[section] as any[]), newItem]
    });
  };

  const removeItem = (section: keyof ResumeData, id: string) => {
    if (!Array.isArray(data[section])) return;
    
    setData({
      ...data,
      [section]: (data[section] as any[]).filter(item => item.id !== id)
    });
  };

  const updateArrayItem = (section: keyof ResumeData, id: string, field: string, value: any) => {
    if (!Array.isArray(data[section])) return;
    
    setData({
      ...data,
      [section]: (data[section] as any[]).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const addHighlight = (section: 'experience' | 'projects', id: string) => {
    if (!Array.isArray(data[section])) return;
    
    setData({
      ...data,
      [section]: (data[section] as any[]).map(item => 
        item.id === id ? { 
          ...item, 
          highlights: [...(item.highlights || []), '']
        } : item
      )
    });
  };

  const updateHighlight = (section: 'experience' | 'projects', itemId: string, index: number, value: string) => {
    if (!Array.isArray(data[section])) return;
    
    setData({
      ...data,
      [section]: (data[section] as any[]).map(item => 
        item.id === itemId ? { 
          ...item, 
          highlights: (item.highlights || []).map((h, i) => i === index ? value : h)
        } : item
      )
    });
  };

  const removeHighlight = (section: 'experience' | 'projects', itemId: string, index: number) => {
    if (!Array.isArray(data[section])) return;
    
    setData({
      ...data,
      [section]: (data[section] as any[]).map(item => 
        item.id === itemId ? { 
          ...item, 
          highlights: (item.highlights || []).filter((_, i) => i !== index)
        } : item
      )
    });
  };

  const handleSave = () => {
    onSave(data);
    toast({
      title: "Changes saved",
      description: "Your resume has been updated.",
    });
  };

  const getSectionStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return "border-l-4 border-emerald-500 pl-4";
      case 'minimalist':
        return "border-b-2 border-slate-200 pb-2";
      case 'classic':
      default:
        return "border-b-2 border-blue-200 pb-2";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className={cn(
        "rounded-md mb-6 p-2 text-center text-sm",
        secondaryColor
      )}>
        <p>Viewing with <span className="font-semibold">{template.name}</span> template. Go to Templates tab to change the style.</p>
      </div>

      <Card className={cn(
        "p-6 transition-all duration-300",
        activeSection === 'personal' ? "ring-2 ring-primary" : "",
        selectedTemplate === 'modern' ? "border-emerald-200" : 
        selectedTemplate === 'minimalist' ? "border-slate-200 shadow-sm" : 
        "border-blue-100"
      )}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={cn(
            "text-xl font-semibold",
            getSectionStyles()
          )}>Personal Information</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
          >
            {activeSection === 'personal' ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </div>
        
        {activeSection === 'personal' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={data.personal?.name || ''} 
                onChange={(e) => updatePersonal('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={data.personal?.email || ''} 
                onChange={(e) => updatePersonal('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={data.personal?.phone || ''} 
                onChange={(e) => updatePersonal('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={data.personal?.location || ''} 
                onChange={(e) => updatePersonal('location', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin" 
                value={data.personal?.linkedin || ''} 
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={data.personal?.website || ''} 
                onChange={(e) => updatePersonal('website', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className={cn(
            "space-y-2",
            selectedTemplate === 'modern' ? "text-emerald-950" : 
            selectedTemplate === 'minimalist' ? "text-slate-900" : 
            "text-blue-950"
          )}>
            <p><span className="font-medium">Name:</span> {data.personal?.name}</p>
            <p><span className="font-medium">Email:</span> {data.personal?.email}</p>
            <p><span className="font-medium">Phone:</span> {data.personal?.phone}</p>
            <p><span className="font-medium">Location:</span> {data.personal?.location}</p>
            {data.personal?.linkedin && (
              <p><span className="font-medium">LinkedIn:</span> {data.personal?.linkedin}</p>
            )}
            {data.personal?.website && (
              <p><span className="font-medium">Website:</span> {data.personal?.website}</p>
            )}
          </div>
        )}
      </Card>

      <Card className={cn(
        "p-6 transition-all duration-300",
        activeSection === 'summary' ? "ring-2 ring-primary" : "",
        selectedTemplate === 'modern' ? "border-emerald-200" : 
        selectedTemplate === 'minimalist' ? "border-slate-200 shadow-sm" : 
        "border-blue-100"
      )}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={cn(
            "text-xl font-semibold",
            getSectionStyles()
          )}>Professional Summary</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setActiveSection(activeSection === 'summary' ? null : 'summary')}
          >
            {activeSection === 'summary' ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </div>
        
        {activeSection === 'summary' ? (
          <div className="space-y-2 animate-slide-up">
            <Textarea 
              value={data.summary || ''} 
              onChange={(e) => updateSummary(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        ) : (
          <p className={cn(
            selectedTemplate === 'modern' ? "text-emerald-950" : 
            selectedTemplate === 'minimalist' ? "text-slate-900" : 
            "text-blue-950"
          )}>{data.summary}</p>
        )}
      </Card>

      <Card className={cn(
        "p-6 transition-all duration-300",
        activeSection === 'experience' ? "ring-2 ring-primary" : "",
        selectedTemplate === 'modern' ? "border-emerald-200" : 
        selectedTemplate === 'minimalist' ? "border-slate-200 shadow-sm" : 
        "border-blue-100"
      )}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={cn(
            "text-xl font-semibold",
            getSectionStyles()
          )}>Work Experience</h2>
          <div className="flex gap-2">
            {activeSection === 'experience' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addItem('experience')}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
            >
              {activeSection === 'experience' ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          {data.experience?.map((exp, index) => (
            <div key={exp.id} className={activeSection === 'experience' ? "animate-slide-up" : ""}>
              {index > 0 && <Separator className={cn(
                "my-4",
                selectedTemplate === 'modern' ? "bg-emerald-100" : 
                selectedTemplate === 'minimalist' ? "bg-slate-100" : 
                "bg-blue-50"
              )} />}
              
              {activeSection === 'experience' ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => removeItem('experience', exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input 
                        value={exp.title || ''} 
                        onChange={(e) => updateArrayItem('experience', exp.id, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input 
                        value={exp.company || ''} 
                        onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input 
                        value={exp.location || ''} 
                        onChange={(e) => updateArrayItem('experience', exp.id, 'location', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input 
                          type="month"
                          value={exp.startDate || ''} 
                          onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input 
                          type="month"
                          value={exp.endDate || ''} 
                          onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={exp.description || ''} 
                      onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Highlights</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addHighlight('experience', exp.id)}
                        className="h-8"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                    
                    {exp.highlights?.map((highlight, i) => (
                      <div key={i} className="flex gap-2">
                        <Input 
                          value={highlight} 
                          onChange={(e) => updateHighlight('experience', exp.id, i, e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeHighlight('experience', exp.id, i)}
                          className="text-destructive h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={cn(
                  selectedTemplate === 'modern' ? "p-4 border-l-2 border-emerald-200" : 
                  selectedTemplate === 'minimalist' ? "" : 
                  "p-2 bg-blue-50/40 rounded-md"
                )}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className={cn(
                        "font-semibold text-lg",
                        selectedTemplate === 'modern' ? "text-emerald-700" : 
                        selectedTemplate === 'minimalist' ? "text-slate-800" : 
                        "text-blue-700"
                      )}>{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company}, {exp.location}</p>
                    </div>
                    <p className={cn(
                      "text-sm",
                      selectedTemplate === 'modern' ? "text-emerald-600 font-medium" : 
                      selectedTemplate === 'minimalist' ? "text-slate-500" : 
                      "text-blue-600 italic"
                    )}>
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''} - 
                      {exp.endDate === 'Present' ? ' Present' : 
                        exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ' Present'}
                    </p>
                  </div>
                  
                  <p className="my-2">{exp.description}</p>
                  
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className={cn(
                      "list-disc space-y-1 mt-2",
                      selectedTemplate === 'modern' ? "list-outside ml-5" : 
                      selectedTemplate === 'minimalist' ? "list-inside" : 
                      "list-inside"
                    )}>
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className={
                          selectedTemplate === 'modern' ? "text-emerald-950" : 
                          selectedTemplate === 'minimalist' ? "text-slate-700" : 
                          "text-blue-950"
                        }>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className={cn(
            "px-8",
            selectedTemplate === 'modern' ? "bg-emerald-600 hover:bg-emerald-700" : 
            selectedTemplate === 'minimalist' ? "bg-slate-800 hover:bg-slate-900" : 
            "bg-blue-600 hover:bg-blue-700"
          )}
        >
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};
