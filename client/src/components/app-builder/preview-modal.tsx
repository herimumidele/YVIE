import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CanvasComponent } from "./canvas";

interface PreviewModalProps {
  components: CanvasComponent[];
  appName: string;
  onClose: () => void;
}

interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  timestamp: string;
  componentResults?: any[];
}

export default function PreviewModal({ components, appName, onClose }: PreviewModalProps) {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Execute workflow mutation
  const executeWorkflow = useMutation({
    mutationFn: async (userInput: string) => {
      return await apiRequest("/api/apps/preview/execute", {
        method: "POST",
        body: {
          workflow: components,
          input: userInput,
          sessionId: `preview_${Date.now()}`
        }
      });
    },
    onSuccess: (result) => {
      setExecutionHistory(prev => [...prev, result]);
      setInput("");
    },
    onError: (error) => {
      const errorResult: ExecutionResult = {
        success: false,
        error: "Failed to execute workflow",
        timestamp: new Date().toISOString()
      };
      setExecutionHistory(prev => [...prev, errorResult]);
      
      toast({
        title: "Execution Failed",
        description: "There was an error running your workflow.",
        variant: "destructive",
      });
    },
  });

  const handleExecute = () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some input to test your workflow.",
        variant: "destructive",
      });
      return;
    }

    executeWorkflow.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  const clearHistory = () => {
    setExecutionHistory([]);
  };

  const renderExecutionResult = (result: ExecutionResult, index: number) => {
    return (
      <Card key={index} className={`mb-4 ${result.success ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium font-poppins">
              Execution #{index + 1}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {result.success ? (
            <div className="space-y-3">
              {result.componentResults && result.componentResults.map((compResult, compIndex) => (
                <div key={compIndex} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Component {compIndex + 1}: {compResult.type || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {renderComponentResult(compResult)}
                  </div>
                </div>
              ))}
              
              {result.result && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-2">Final Result:</div>
                  <div className="text-sm text-green-700">
                    {typeof result.result === 'string' 
                      ? result.result 
                      : JSON.stringify(result.result, null, 2)
                    }
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-800 mb-2">Error:</div>
              <div className="text-sm text-red-700">{result.error}</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderComponentResult = (compResult: any) => {
    switch (compResult.type) {
      case 'chatbot':
        return compResult.response || 'No response generated';
      
      case 'text-analysis':
        return (
          <div className="space-y-1">
            <div>Sentiment: {compResult.result?.sentiment || 'Unknown'}</div>
            <div>Confidence: {compResult.result?.confidence || 'Unknown'}</div>
            {compResult.result?.keywords && (
              <div>Keywords: {compResult.result.keywords.join(', ')}</div>
            )}
          </div>
        );
      
      case 'image-generation':
        return (
          <div className="space-y-2">
            <div>Image generated successfully</div>
            {compResult.imageUrl && (
              <img 
                src={compResult.imageUrl} 
                alt="Generated" 
                className="max-w-48 rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        );
      
      case 'data-processor':
        return (
          <div>
            <div>Operation: {compResult.operation}</div>
            <div className="mt-2 p-2 bg-white rounded border font-mono text-xs">
              {JSON.stringify(compResult.output, null, 2)}
            </div>
          </div>
        );
      
      case 'api-call':
        return (
          <div>
            <div>Status: {compResult.response?.status || 'Unknown'}</div>
            <div className="mt-2 p-2 bg-white rounded border font-mono text-xs">
              {JSON.stringify(compResult.response?.data, null, 2)}
            </div>
          </div>
        );
      
      default:
        return JSON.stringify(compResult, null, 2);
    }
  };

  const getWorkflowSummary = () => {
    const types = components.map(c => c.type);
    const typeCount = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCount)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-poppins">
            Preview: {appName || 'Untitled App'}
          </DialogTitle>
          <div className="text-sm text-gray-600 font-roboto">
            Workflow: {getWorkflowSummary()}
          </div>
        </DialogHeader>

        <div className="flex flex-1 gap-4 min-h-0">
          {/* Input Section */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium font-poppins mb-2 block">
                  Test Input
                </label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter text to test your AI workflow..."
                  className="min-h-20 font-roboto"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    onClick={handleExecute}
                    disabled={executeWorkflow.isPending || !input.trim()}
                    className="gradient-primary hover:gradient-primary-hover"
                  >
                    {executeWorkflow.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Run Workflow
                  </Button>
                  
                  {executionHistory.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearHistory}
                      className="border-gray-300"
                    >
                      Clear History
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 font-roboto">
                  Press Enter to execute
                </div>
              </div>
            </div>

            <Separator />

            {/* Results Section */}
            <div className="flex-1 min-h-0">
              <div className="flex items-center justify-between py-3">
                <h3 className="font-semibold font-poppins">Execution Results</h3>
                <div className="text-sm text-gray-500 font-roboto">
                  {executionHistory.length} execution{executionHistory.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <ScrollArea className="h-full">
                {executionHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-roboto">
                        Enter input above and click "Run Workflow" to test your app
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {executionHistory.map((result, index) => 
                      renderExecutionResult(result, index)
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Workflow Visualization */}
          <div className="w-80 border-l border-gray-200 pl-4">
            <h3 className="font-semibold font-poppins mb-3">Workflow Steps</h3>
            <div className="space-y-3">
              {components.map((component, index) => (
                <Card key={component.id} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary-blue to-cyan rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-sm font-poppins">
                        {component.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <div className="text-xs text-gray-600 font-roboto">
                      Type: {component.type}
                    </div>
                  </CardContent>
                  
                  {index < components.length - 1 && (
                    <div className="flex justify-center pb-2">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-primary-blue to-cyan"></div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}