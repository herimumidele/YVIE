import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BarChart3, Image, Cpu, Zap, Plus, Search, Mic, FileText, Code, Brain, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComponentTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  defaultConfig: Record<string, any>;
}

interface ComponentSidebarProps {
  onAddComponent: (template: ComponentTemplate) => void;
}

const componentTemplates: ComponentTemplate[] = [
  {
    id: 'chatbot',
    type: 'chatbot',
    name: 'AI Chatbot',
    description: 'Conversational AI that can answer questions and provide assistance',
    icon: <MessageSquare className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      model: 'gpt-3.5-turbo',
      systemPrompt: 'You are a helpful AI assistant.',
      temperature: 0.7,
      maxTokens: 150
    }
  },
  {
    id: 'text-analysis',
    type: 'text-analysis',
    name: 'Text Analysis',
    description: 'Analyze text for sentiment, topics, entities, and more',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      analysisType: 'sentiment',
      language: 'auto',
      confidence: 0.8,
      includeKeywords: true
    }
  },
  {
    id: 'image-generation',
    type: 'image-generation',
    name: 'Image Generator',
    description: 'Generate images from text descriptions using AI',
    icon: <Image className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      model: 'dall-e-3',
      style: 'realistic',
      size: '1024x1024',
      quality: 'standard'
    }
  },
  {
    id: 'data-processor',
    type: 'data-processor',
    name: 'Data Processor',
    description: 'Transform, filter, and manipulate data structures',
    icon: <Cpu className="h-5 w-5" />,
    category: 'Utility',
    defaultConfig: {
      operation: 'transform',
      outputFormat: 'json',
      filters: [],
      transformations: []
    }
  },
  {
    id: 'api-call',
    type: 'api-call',
    name: 'API Call',
    description: 'Make HTTP requests to external APIs and services',
    icon: <Zap className="h-5 w-5" />,
    category: 'Integration',
    defaultConfig: {
      method: 'POST',
      url: '',
      headers: {},
      timeout: 30
    }
  },
  {
    id: 'speech-to-text',
    type: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Convert audio recordings to text using AI',
    icon: <Mic className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      language: 'en',
      model: 'whisper-1',
      responseFormat: 'text',
      temperature: 0
    }
  },
  {
    id: 'document-analysis',
    type: 'document-analysis',
    name: 'Document Analysis',
    description: 'Extract and analyze information from documents',
    icon: <FileText className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      extractText: true,
      extractTables: true,
      extractImages: false,
      analysisType: 'summary'
    }
  },
  {
    id: 'code-generator',
    type: 'code-generator',
    name: 'Code Generator',
    description: 'Generate code snippets in various programming languages',
    icon: <Code className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      language: 'javascript',
      framework: 'none',
      style: 'functional',
      includeComments: true
    }
  },
  {
    id: 'visual-search',
    type: 'visual-search',
    name: 'Visual Search',
    description: 'Search and identify objects, text, or patterns in images',
    icon: <Camera className="h-5 w-5" />,
    category: 'AI',
    defaultConfig: {
      searchType: 'objects',
      confidence: 0.7,
      maxResults: 10,
      includeLabels: true
    }
  }
];

const categories = ['All', 'AI', 'Utility', 'Integration'];

export default function ComponentSidebar({ onAddComponent }: ComponentSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredComponents = selectedCategory === 'All' 
    ? componentTemplates 
    : componentTemplates.filter(comp => comp.category === selectedCategory);

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold font-poppins text-navy">AI Components</h2>
        <p className="text-sm text-gray-500 font-roboto">
          Drag or click to add components to your workflow
        </p>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "text-xs",
                selectedCategory === category 
                  ? "gradient-primary text-white" 
                  : "border-gray-300 text-gray-600 hover:border-primary-blue"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredComponents.map((template) => (
            <ComponentCard
              key={template.id}
              template={template}
              onAdd={onAddComponent}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-navy font-poppins mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-gray-600 font-roboto mb-3">
            Learn how to build AI workflows with our documentation
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
          >
            View Docs
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ComponentCardProps {
  template: ComponentTemplate;
  onAdd: (template: ComponentTemplate) => void;
}

function ComponentCard({ template, onAdd }: ComponentCardProps) {
  const handleAddComponent = () => {
    onAdd(template);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI':
        return 'from-blue-500 to-blue-600';
      case 'Utility':
        return 'from-orange-500 to-orange-600';
      case 'Integration':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary-blue group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br",
              getCategoryColor(template.category)
            )}>
              {template.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold font-poppins">
                {template.name}
              </CardTitle>
              <div className="text-xs text-gray-500 font-roboto mt-1">
                {template.category}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity gradient-primary hover:gradient-primary-hover"
            onClick={handleAddComponent}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs font-roboto leading-relaxed">
          {template.description}
        </CardDescription>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs border-gray-300 text-gray-600 hover:border-primary-blue hover:text-primary-blue"
            onClick={handleAddComponent}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add to Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

