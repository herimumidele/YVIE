import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, FileText, Image, Code, Mic, Eye, Zap, ArrowRight, PlayCircle } from "lucide-react";
import { CanvasComponent } from "./canvas";

interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  components: CanvasComponent[];
  useCase: string;
  benefits: string[];
  icon: React.ReactNode;
  workflow: string;
  estimatedTime: string;
}

const AI_TEMPLATES: AITemplate[] = [
  {
    id: "document-processor",
    name: "Intelligent Document Processor",
    description: "Extract and analyze information from documents like invoices, forms, and contracts",
    category: "Document Processing",
    difficulty: "Intermediate",
    useCase: "Automatically process invoices, extract key information, and categorize documents",
    benefits: [
      "Reduces manual data entry by 90%",
      "Improves accuracy in document processing",
      "Saves 4-6 hours per day on document tasks",
      "Integrates with existing workflows"
    ],
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    workflow: "Upload Document → Extract Text → Analyze Content → Categorize → Generate Summary",
    estimatedTime: "15-30 minutes to setup",
    components: [
      {
        id: "doc-upload",
        type: "document-analysis",
        name: "Document Upload",
        config: {
          extractText: true,
          extractTables: true,
          analysisType: "summary"
        },
        position: { x: 100, y: 100 }
      },
      {
        id: "text-analysis",
        type: "text-analysis",
        name: "Content Analysis",
        config: {
          analysisType: "entities",
          language: "en"
        },
        position: { x: 300, y: 100 }
      },
      {
        id: "data-processor",
        type: "data-processor",
        name: "Data Processor",
        config: {
          operation: "transform",
          outputFormat: "json"
        },
        position: { x: 500, y: 100 }
      }
    ]
  },
  {
    id: "customer-service-bot",
    name: "AI Customer Service Assistant",
    description: "Intelligent chatbot that handles customer inquiries and provides personalized responses",
    category: "Customer Service",
    difficulty: "Beginner",
    useCase: "Handle customer support tickets, answer FAQs, and escalate complex issues",
    benefits: [
      "24/7 customer support availability",
      "Reduces response time by 80%",
      "Handles 70% of routine inquiries",
      "Improves customer satisfaction"
    ],
    icon: <Bot className="h-6 w-6 text-green-500" />,
    workflow: "Customer Query → Understand Intent → Generate Response → Sentiment Check → Respond",
    estimatedTime: "10-20 minutes to setup",
    components: [
      {
        id: "chatbot",
        type: "chatbot",
        name: "Customer Bot",
        config: {
          model: "gpt-4",
          temperature: 0.7,
          maxTokens: 500,
          systemPrompt: "You are a helpful customer service assistant."
        },
        position: { x: 100, y: 100 }
      },
      {
        id: "sentiment",
        type: "text-analysis",
        name: "Sentiment Analysis",
        config: {
          analysisType: "sentiment",
          language: "en"
        },
        position: { x: 300, y: 100 }
      }
    ]
  },
  {
    id: "content-creator",
    name: "AI Content Creation Suite",
    description: "Generate marketing copy, social media posts, and visual content automatically",
    category: "Content Creation",
    difficulty: "Intermediate",
    useCase: "Create blog posts, social media content, and marketing materials",
    benefits: [
      "Generates content 10x faster",
      "Maintains brand consistency",
      "Creates multi-format content",
      "Optimizes for engagement"
    ],
    icon: <Image className="h-6 w-6 text-purple-500" />,
    workflow: "Content Brief → Generate Text → Create Images → Optimize → Publish",
    estimatedTime: "20-40 minutes to setup",
    components: [
      {
        id: "text-generator",
        type: "chatbot",
        name: "Content Generator",
        config: {
          model: "gpt-4",
          temperature: 0.8,
          maxTokens: 1000,
          systemPrompt: "You are a creative content writer."
        },
        position: { x: 100, y: 100 }
      },
      {
        id: "image-gen",
        type: "image-generation",
        name: "Image Creator",
        config: {
          model: "dall-e-3",
          size: "1024x1024",
          style: "vivid"
        },
        position: { x: 300, y: 100 }
      },
      {
        id: "content-optimizer",
        type: "text-analysis",
        name: "Content Optimizer",
        config: {
          analysisType: "keywords",
          language: "en"
        },
        position: { x: 500, y: 100 }
      }
    ]
  },
  {
    id: "code-assistant",
    name: "AI Code Generator & Reviewer",
    description: "Generate, review, and optimize code across multiple programming languages",
    category: "Development",
    difficulty: "Advanced",
    useCase: "Generate boilerplate code, review pull requests, and suggest optimizations",
    benefits: [
      "Speeds up development by 60%",
      "Reduces bugs through automated review",
      "Supports 10+ programming languages",
      "Generates documentation automatically"
    ],
    icon: <Code className="h-6 w-6 text-orange-500" />,
    workflow: "Code Request → Generate Code → Review Quality → Optimize → Document",
    estimatedTime: "30-60 minutes to setup",
    components: [
      {
        id: "code-gen",
        type: "code-generator",
        name: "Code Generator",
        config: {
          language: "javascript",
          framework: "react",
          style: "functional",
          includeComments: true
        },
        position: { x: 100, y: 100 }
      },
      {
        id: "code-review",
        type: "text-analysis",
        name: "Code Reviewer",
        config: {
          analysisType: "classification",
          language: "en"
        },
        position: { x: 300, y: 100 }
      }
    ]
  },
  {
    id: "voice-assistant",
    name: "Voice-Powered AI Assistant",
    description: "Convert speech to text, process commands, and provide voice responses",
    category: "Voice Processing",
    difficulty: "Advanced",
    useCase: "Create voice-controlled applications and transcription services",
    benefits: [
      "Hands-free operation",
      "95% accuracy in speech recognition",
      "Supports multiple languages",
      "Real-time processing"
    ],
    icon: <Mic className="h-6 w-6 text-red-500" />,
    workflow: "Voice Input → Speech to Text → Process Command → Generate Response → Text to Speech",
    estimatedTime: "25-45 minutes to setup",
    components: [
      {
        id: "speech-to-text",
        type: "speech-to-text",
        name: "Voice Recognition",
        config: {
          language: "en",
          model: "whisper-1",
          responseFormat: "text"
        },
        position: { x: 100, y: 100 }
      },
      {
        id: "command-processor",
        type: "chatbot",
        name: "Command Processor",
        config: {
          model: "gpt-4",
          temperature: 0.3,
          maxTokens: 300,
          systemPrompt: "You are a voice assistant. Be concise and helpful."
        },
        position: { x: 300, y: 100 }
      }
    ]
  },
  {
    id: "visual-analyzer",
    name: "Visual Content Analyzer",
    description: "Analyze images and videos to detect objects, extract text, and identify patterns",
    category: "Computer Vision",
    difficulty: "Intermediate",
    useCase: "Analyze product images, moderate content, and extract information from visuals",
    benefits: [
      "Automates visual content review",
      "Identifies objects with 95% accuracy",
      "Extracts text from images (OCR)",
      "Detects inappropriate content"
    ],
    icon: <Eye className="h-6 w-6 text-teal-500" />,
    workflow: "Image Upload → Object Detection → Text Extraction → Analysis → Report",
    estimatedTime: "20-35 minutes to setup",
    components: [
      {
        id: "visual-search",
        type: "visual-search",
        name: "Visual Analyzer",
        config: {
          searchType: "objects",
          confidence: 0.8,
          maxResults: 10,
          includeLabels: true
        },
        position: { x: 100, y: 100 }
      },
      {
        id: "image-processor",
        type: "data-processor",
        name: "Image Processor",
        config: {
          operation: "transform",
          outputFormat: "json"
        },
        position: { x: 300, y: 100 }
      }
    ]
  }
];

interface TemplateShowcaseProps {
  onSelectTemplate: (template: AITemplate) => void;
  onClose: () => void;
}

export default function TemplateShowcase({ onSelectTemplate, onClose }: TemplateShowcaseProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(AI_TEMPLATES.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "All" 
    ? AI_TEMPLATES 
    : AI_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: AITemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy font-poppins mb-2">
          AI Application Templates
        </h2>
        <p className="text-gray-600 font-roboto">
          Choose from our collection of pre-built AI workflows to get started quickly
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {template.icon}
                  <div>
                    <CardTitle className="text-lg font-poppins">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 font-roboto">
                {template.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4" />
                  <span>{template.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ArrowRight className="h-4 w-4" />
                  <span>{template.components.length} components</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {template.icon}
                        {template.name}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="mt-4 h-[60vh]">
                      <TemplatePreview template={template} />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleUseTemplate(template)}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TemplatePreview({ template }: { template: AITemplate }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-navy mb-2">Use Case</h3>
            <p className="text-sm text-gray-600">{template.useCase}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-navy mb-2">Workflow</h3>
            <p className="text-sm text-gray-600">{template.workflow}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-navy mb-2">Key Benefits</h3>
          <ul className="space-y-1">
            {template.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-navy mb-3">Components ({template.components.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {template.components.map((component, index) => (
            <div key={component.id} className="p-3 border rounded-lg bg-gray-50">
              <div className="font-medium text-sm text-navy">{component.name}</div>
              <div className="text-xs text-gray-500 capitalize">{component.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}