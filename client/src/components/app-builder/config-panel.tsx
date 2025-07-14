import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, RotateCcw } from "lucide-react";
import { CanvasComponent } from "./canvas";

interface ConfigPanelProps {
  component: CanvasComponent | null;
  onConfigChange: (componentId: string, config: Record<string, any>) => void;
  onClose: () => void;
}

export default function ConfigPanel({ component, onConfigChange, onClose }: ConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (component) {
      setLocalConfig(component.config || {});
    }
  }, [component]);

  if (!component) {
    return (
      <div className="w-80 border-l border-gray-200 bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 font-poppins mb-2">
            No Component Selected
          </h3>
          <p className="text-sm text-gray-500 font-roboto">
            Select a component from the canvas to configure its settings
          </p>
        </div>
      </div>
    );
  }

  const handleConfigUpdate = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
  };

  const handleSave = () => {
    onConfigChange(component.id, localConfig);
  };

  const handleReset = () => {
    setLocalConfig(component.config || {});
  };

  const renderConfigFields = () => {
    switch (component.type) {
      case 'chatbot':
        return <ChatbotConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'text-analysis':
        return <TextAnalysisConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'image-generation':
        return <ImageGenerationConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'data-processor':
        return <DataProcessorConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'api-call':
        return <ApiCallConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'speech-to-text':
        return <SpeechToTextConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'document-analysis':
        return <DocumentAnalysisConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'code-generator':
        return <CodeGeneratorConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      case 'visual-search':
        return <VisualSearchConfig config={localConfig} onUpdate={handleConfigUpdate} />;
      default:
        return <GenericConfig config={localConfig} onUpdate={handleConfigUpdate} />;
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold font-poppins text-navy">
              Configure Component
            </h2>
            <p className="text-sm text-gray-500 font-roboto">
              {component.name}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-gray-300"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Configuration Form */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="componentName" className="text-sm font-medium">
                Component Name
              </Label>
              <Input
                id="componentName"
                value={component.name}
                onChange={(e) => handleConfigUpdate('name', e.target.value)}
                className="mt-1"
                placeholder="Enter component name"
              />
            </div>
          </div>

          <Separator />

          {/* Component-specific configuration */}
          {renderConfigFields()}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="flex-1 gradient-primary hover:gradient-primary-hover"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// Configuration components for each component type
function ChatbotConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Chatbot Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">AI Model</Label>
        <Select
          value={config.model || 'gpt-3.5-turbo'}
          onValueChange={(value) => onUpdate('model', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude-3">Claude 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">System Prompt</Label>
        <Textarea
          value={config.systemPrompt || ''}
          onChange={(e) => onUpdate('systemPrompt', e.target.value)}
          className="mt-1"
          rows={3}
          placeholder="Define the AI's personality and behavior..."
        />
      </div>

      <div>
        <Label className="text-sm font-medium">
          Temperature: {config.temperature || 0.7}
        </Label>
        <Slider
          value={[config.temperature || 0.7]}
          onValueChange={(value) => onUpdate('temperature', value[0])}
          max={1}
          min={0}
          step={0.1}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Focused</span>
          <span>Creative</span>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Max Response Length</Label>
        <Input
          type="number"
          value={config.maxTokens || 150}
          onChange={(e) => onUpdate('maxTokens', parseInt(e.target.value))}
          className="mt-1"
          min={10}
          max={1000}
        />
      </div>
    </div>
  );
}

function TextAnalysisConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Text Analysis Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Analysis Type</Label>
        <Select
          value={config.analysisType || 'sentiment'}
          onValueChange={(value) => onUpdate('analysisType', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
            <SelectItem value="emotion">Emotion Detection</SelectItem>
            <SelectItem value="topics">Topic Extraction</SelectItem>
            <SelectItem value="entities">Named Entity Recognition</SelectItem>
            <SelectItem value="keywords">Keyword Extraction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Language</Label>
        <Select
          value={config.language || 'auto'}
          onValueChange={(value) => onUpdate('language', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto-detect</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Include Keywords</Label>
        <Switch
          checked={config.includeKeywords || false}
          onCheckedChange={(checked) => onUpdate('includeKeywords', checked)}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">
          Confidence Threshold: {config.confidence || 0.8}
        </Label>
        <Slider
          value={[config.confidence || 0.8]}
          onValueChange={(value) => onUpdate('confidence', value[0])}
          max={1}
          min={0}
          step={0.1}
          className="mt-2"
        />
      </div>
    </div>
  );
}

function ImageGenerationConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Image Generation Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Model</Label>
        <Select
          value={config.model || 'dall-e-3'}
          onValueChange={(value) => onUpdate('model', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
            <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
            <SelectItem value="midjourney">Midjourney</SelectItem>
            <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Style</Label>
        <Select
          value={config.style || 'realistic'}
          onValueChange={(value) => onUpdate('style', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realistic">Realistic</SelectItem>
            <SelectItem value="artistic">Artistic</SelectItem>
            <SelectItem value="cartoon">Cartoon</SelectItem>
            <SelectItem value="abstract">Abstract</SelectItem>
            <SelectItem value="photographic">Photographic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Image Size</Label>
        <Select
          value={config.size || '1024x1024'}
          onValueChange={(value) => onUpdate('size', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="512x512">512×512</SelectItem>
            <SelectItem value="1024x1024">1024×1024</SelectItem>
            <SelectItem value="1024x1792">1024×1792 (Portrait)</SelectItem>
            <SelectItem value="1792x1024">1792×1024 (Landscape)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Quality</Label>
        <Select
          value={config.quality || 'standard'}
          onValueChange={(value) => onUpdate('quality', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="hd">HD (Higher cost)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function DataProcessorConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Data Processor Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Operation</Label>
        <Select
          value={config.operation || 'transform'}
          onValueChange={(value) => onUpdate('operation', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transform">Transform Data</SelectItem>
            <SelectItem value="filter">Filter Data</SelectItem>
            <SelectItem value="merge">Merge Data</SelectItem>
            <SelectItem value="split">Split Data</SelectItem>
            <SelectItem value="aggregate">Aggregate Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Output Format</Label>
        <Select
          value={config.outputFormat || 'json'}
          onValueChange={(value) => onUpdate('outputFormat', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
            <SelectItem value="text">Plain Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Transformation Rules</Label>
        <Textarea
          value={config.transformationRules || ''}
          onChange={(e) => onUpdate('transformationRules', e.target.value)}
          className="mt-1"
          rows={3}
          placeholder="Define how data should be transformed..."
        />
      </div>
    </div>
  );
}

function ApiCallConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">API Call Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">HTTP Method</Label>
        <Select
          value={config.method || 'POST'}
          onValueChange={(value) => onUpdate('method', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">URL</Label>
        <Input
          value={config.url || ''}
          onChange={(e) => onUpdate('url', e.target.value)}
          className="mt-1"
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Headers (JSON)</Label>
        <Textarea
          value={JSON.stringify(config.headers || {}, null, 2)}
          onChange={(e) => {
            try {
              onUpdate('headers', JSON.parse(e.target.value));
            } catch {
              // Invalid JSON, ignore
            }
          }}
          className="mt-1 font-mono text-sm"
          rows={3}
          placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Timeout (seconds)</Label>
        <Input
          type="number"
          value={config.timeout || 30}
          onChange={(e) => onUpdate('timeout', parseInt(e.target.value))}
          className="mt-1"
          min={1}
          max={300}
        />
      </div>
    </div>
  );
}

function GenericConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Component Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Configuration (JSON)</Label>
        <Textarea
          value={JSON.stringify(config, null, 2)}
          onChange={(e) => {
            try {
              onUpdate('config', JSON.parse(e.target.value));
            } catch {
              // Invalid JSON, ignore
            }
          }}
          className="mt-1 font-mono text-sm"
          rows={6}
          placeholder="{}"
        />
      </div>
    </div>
  );
}

// Speech to Text Configuration
function SpeechToTextConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Speech to Text Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Language</Label>
        <Select
          value={config.language || 'en'}
          onValueChange={(value) => onUpdate('language', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Model</Label>
        <Select
          value={config.model || 'whisper-1'}
          onValueChange={(value) => onUpdate('model', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whisper-1">Whisper v1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Response Format</Label>
        <Select
          value={config.responseFormat || 'text'}
          onValueChange={(value) => onUpdate('responseFormat', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="srt">SRT</SelectItem>
            <SelectItem value="vtt">VTT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Temperature: {config.temperature || 0}</Label>
        <Slider
          value={[config.temperature || 0]}
          onValueChange={(value) => onUpdate('temperature', value[0])}
          max={1}
          min={0}
          step={0.1}
          className="mt-2"
        />
      </div>
    </div>
  );
}

// Document Analysis Configuration
function DocumentAnalysisConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Document Analysis Settings</h3>
      
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Extract Text</Label>
        <Switch
          checked={config.extractText || true}
          onCheckedChange={(checked) => onUpdate('extractText', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Extract Tables</Label>
        <Switch
          checked={config.extractTables || true}
          onCheckedChange={(checked) => onUpdate('extractTables', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Extract Images</Label>
        <Switch
          checked={config.extractImages || false}
          onCheckedChange={(checked) => onUpdate('extractImages', checked)}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Analysis Type</Label>
        <Select
          value={config.analysisType || 'summary'}
          onValueChange={(value) => onUpdate('analysisType', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summary">Summary</SelectItem>
            <SelectItem value="keywords">Keywords</SelectItem>
            <SelectItem value="entities">Named Entities</SelectItem>
            <SelectItem value="sentiment">Sentiment</SelectItem>
            <SelectItem value="classification">Classification</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Code Generator Configuration
function CodeGeneratorConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Code Generator Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Programming Language</Label>
        <Select
          value={config.language || 'javascript'}
          onValueChange={(value) => onUpdate('language', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="swift">Swift</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Framework</Label>
        <Select
          value={config.framework || 'none'}
          onValueChange={(value) => onUpdate('framework', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue.js</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="express">Express.js</SelectItem>
            <SelectItem value="django">Django</SelectItem>
            <SelectItem value="flask">Flask</SelectItem>
            <SelectItem value="spring">Spring</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Code Style</Label>
        <Select
          value={config.style || 'functional'}
          onValueChange={(value) => onUpdate('style', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="functional">Functional</SelectItem>
            <SelectItem value="oop">Object-Oriented</SelectItem>
            <SelectItem value="procedural">Procedural</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Include Comments</Label>
        <Switch
          checked={config.includeComments || true}
          onCheckedChange={(checked) => onUpdate('includeComments', checked)}
        />
      </div>
    </div>
  );
}

// Visual Search Configuration
function VisualSearchConfig({ config, onUpdate }: ConfigComponentProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy font-poppins">Visual Search Settings</h3>
      
      <div>
        <Label className="text-sm font-medium">Search Type</Label>
        <Select
          value={config.searchType || 'objects'}
          onValueChange={(value) => onUpdate('searchType', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="objects">Objects</SelectItem>
            <SelectItem value="text">Text (OCR)</SelectItem>
            <SelectItem value="faces">Faces</SelectItem>
            <SelectItem value="landmarks">Landmarks</SelectItem>
            <SelectItem value="brands">Brands</SelectItem>
            <SelectItem value="activities">Activities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Confidence Threshold: {config.confidence || 0.7}</Label>
        <Slider
          value={[config.confidence || 0.7]}
          onValueChange={(value) => onUpdate('confidence', value[0])}
          max={1}
          min={0.1}
          step={0.1}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Max Results</Label>
        <Input
          type="number"
          value={config.maxResults || 10}
          onChange={(e) => onUpdate('maxResults', parseInt(e.target.value))}
          className="mt-1"
          min={1}
          max={100}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Include Labels</Label>
        <Switch
          checked={config.includeLabels || true}
          onCheckedChange={(checked) => onUpdate('includeLabels', checked)}
        />
      </div>
    </div>
  );
}

interface ConfigComponentProps {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}