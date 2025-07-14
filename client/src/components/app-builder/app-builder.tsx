import React, { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Play, Eye, Share, Settings as SettingsIcon, Layers } from "lucide-react";
import Canvas, { CanvasComponent } from "./canvas";
import ComponentSidebar, { ComponentTemplate } from "./component-sidebar";
import ConfigPanel from "./config-panel";
import TemplateShowcase from "./template-showcase";
import PreviewModal from "./preview-modal";

interface AppBuilderProps {
  appId?: number;
  isNewApp?: boolean;
  templateId?: number;
}

export default function AppBuilder({ appId, isNewApp = false, templateId }: AppBuilderProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // App state
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appCategory, setAppCategory] = useState("chatbot");
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Load existing app data
  const { data: app, isLoading } = useQuery({
    queryKey: [`/api/apps/${appId}`],
    enabled: !isNewApp && !!appId,
  });

  // Load template data if templateId is provided
  const { data: template, isLoading: isTemplateLoading } = useQuery({
    queryKey: [`/api/templates/${templateId}`],
    enabled: isNewApp && !!templateId,
  });

  // Initialize app data when loaded
  useEffect(() => {
    if (app && !isNewApp) {
      setAppName((app as any).name || "");
      setAppDescription((app as any).description || "");
      setAppCategory((app as any).category || "chatbot");
      
      if ((app as any).config?.workflow) {
        setComponents((app as any).config.workflow);
      }
    }
  }, [app, isNewApp]);

  // Initialize template data when loaded
  useEffect(() => {
    if (template && isNewApp && templateId) {
      setAppName((template as any).name || "");
      setAppDescription((template as any).description || "");
      setAppCategory((template as any).category || "chatbot");
      
      if ((template as any).components) {
        setComponents((template as any).components);
      }
    }
  }, [template, isNewApp, templateId]);

  // Save app mutation
  const saveAppMutation = useMutation({
    mutationFn: async (appData: any) => {
      const url = isNewApp ? "/api/apps" : `/api/apps/${appId}`;
      const method = isNewApp ? "POST" : "PUT";
      return await apiRequest(url, { method, body: appData });
    },
    onSuccess: (data) => {
      toast({
        title: "App Saved",
        description: "Your app has been saved successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      if (appId) {
        queryClient.invalidateQueries({ queryKey: [`/api/apps/${appId}`] });
      }
      
      if (isNewApp && data?.id) {
        setLocation(`/create-app/${data.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Failed to save your app. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Deploy app mutation
  const deployAppMutation = useMutation({
    mutationFn: async () => {
      if (!appId) throw new Error("No app ID");
      return await apiRequest(`/api/apps/${appId}/deploy`, { method: "POST" });
    },
    onSuccess: (data) => {
      toast({
        title: "App Deployed",
        description: `Your app is now live at ${data?.deploymentUrl || 'the deployment URL'}`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/apps/${appId}`] });
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy your app. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Component management
  const handleAddComponent = useCallback((template: ComponentTemplate) => {
    const newComponent: CanvasComponent = {
      id: `${template.type}_${Date.now()}`,
      type: template.type,
      name: template.name,
      config: { ...template.defaultConfig },
      position: { x: 0, y: components.length * 100 }
    };

    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent);
  }, [components.length]);

  const handleComponentsChange = useCallback((newComponents: CanvasComponent[]) => {
    setComponents(newComponents);
  }, []);

  const handleComponentSelect = useCallback((component: CanvasComponent | null) => {
    setSelectedComponent(component);
  }, []);

  const handleConfigChange = useCallback((componentId: string, config: Record<string, any>) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, config: { ...comp.config, ...config } }
          : comp
      )
    );
  }, []);

  // Template handling
  const handleSelectTemplate = useCallback((template: any) => {
    setAppName(template.name);
    setAppDescription(template.description);
    setAppCategory(template.category.toLowerCase().replace(/\s+/g, '-'));
    setComponents(template.components);
    setSelectedComponent(null);
    
    toast({
      title: "Template Applied",
      description: `${template.name} template has been loaded successfully.`,
    });
  }, [toast]);

  const handleSave = () => {
    if (!appName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your app.",
        variant: "destructive",
      });
      return;
    }

    saveAppMutation.mutate({
      name: appName,
      description: appDescription,
      category: appCategory,
      config: { workflow: components },
    });
  };

  const handlePreview = () => {
    if (components.length === 0) {
      toast({
        title: "No Components",
        description: "Add some components to your app before previewing.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handleDeploy = () => {
    if (!appId) {
      toast({
        title: "Save First",
        description: "Please save your app before deploying.",
        variant: "destructive",
      });
      return;
    }
    deployAppMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading app builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/my-apps")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Apps
            </Button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-navy font-poppins">
                {isNewApp ? "Create New App" : "Edit App"}
              </h1>
              {!isNewApp && appId && (
                <Badge variant="outline">ID: {appId}</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(true)}
            >
              <Layers className="h-4 w-4 mr-2" />
              Templates
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={components.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveAppMutation.isPending}
            >
              {saveAppMutation.isPending ? "Saving..." : "Save"}
            </Button>

            {!isNewApp && (
              <Button
                size="sm"
                onClick={handleDeploy}
                disabled={deployAppMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {deployAppMutation.isPending ? "Deploying..." : "Deploy"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Sidebar */}
        <ComponentSidebar onAddComponent={handleAddComponent} />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <Canvas
            components={components}
            onComponentsChange={handleComponentsChange}
            onComponentSelect={handleComponentSelect}
            selectedComponent={selectedComponent}
            onSave={handleSave}
            onPreview={handlePreview}
          />
        </div>

        {/* Config Panel */}
        <ConfigPanel
          component={selectedComponent}
          onConfigChange={handleConfigChange}
          onClose={() => setSelectedComponent(null)}
        />
      </div>

      {/* Dialogs */}
      {showTemplates && (
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-7xl max-h-[90vh] p-0">
            <TemplateShowcase
              onSelectTemplate={handleSelectTemplate}
              onClose={() => setShowTemplates(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showPreview && (
        <PreviewModal
          components={components}
          appName={appName}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showSettings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>App Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="app-name">App Name</Label>
                <Input
                  id="app-name"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Enter app name"
                />
              </div>
              
              <div>
                <Label htmlFor="app-description">Description</Label>
                <Textarea
                  id="app-description"
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="Describe what your app does"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="app-category">Category</Label>
                <Select value={appCategory} onValueChange={setAppCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatbot">Chatbot</SelectItem>
                    <SelectItem value="content-creation">Content Creation</SelectItem>
                    <SelectItem value="document-processing">Document Processing</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="voice-processing">Voice Processing</SelectItem>
                    <SelectItem value="computer-vision">Computer Vision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}