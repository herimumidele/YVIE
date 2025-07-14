import { useState, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, Play, Save, MessageSquare, BarChart3, Image, Cpu, Zap, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CanvasComponent {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface CanvasProps {
  components: CanvasComponent[];
  onComponentsChange: (components: CanvasComponent[]) => void;
  onComponentSelect: (component: CanvasComponent | null) => void;
  selectedComponent: CanvasComponent | null;
  onSave: () => void;
  onPreview: () => void;
}

export default function Canvas({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponent,
  onSave,
  onPreview
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleComponentClick = (component: CanvasComponent) => {
    onComponentSelect(component);
  };

  const handleDeleteComponent = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newComponents = components.filter(comp => comp.id !== componentId);
    onComponentsChange(newComponents);
    if (selectedComponent?.id === componentId) {
      onComponentSelect(null);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newComponents = Array.from(components);
    const [reorderedItem] = newComponents.splice(result.source.index, 1);
    newComponents.splice(result.destination.index, 0, reorderedItem);

    onComponentsChange(newComponents);
  };

  const renderComponent = (component: CanvasComponent, index: number, dragHandleProps?: any) => {
    const isSelected = selectedComponent?.id === component.id;
    
    return (
      <div key={component.id} className="mb-4 group">
        <Card 
          className={cn(
            "cursor-pointer border-2 transition-all duration-200 hover:shadow-lg relative",
            isSelected ? "border-cyan ring-2 ring-cyan/20 shadow-lg" : "border-gray-200 hover:border-primary-blue"
          )}
          onClick={() => handleComponentClick(component)}
        >
          {/* Component Number Badge */}
          <div className="absolute -left-3 -top-3 w-6 h-6 bg-gradient-to-r from-primary-blue to-cyan rounded-full flex items-center justify-center text-white text-xs font-bold">
            {index + 1}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium font-poppins flex items-center">
                <ComponentIcon type={component.type} />
                <span className="ml-2">{component.name}</span>
              </CardTitle>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  {...dragHandleProps}
                  className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4 text-gray-500" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-navy"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentSelect(component);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                  onClick={(e) => handleDeleteComponent(component.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ComponentPreview component={component} />
          </CardContent>

          {/* Connection Line */}
          {index < components.length - 1 && (
            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-primary-blue to-cyan transform -translate-x-0.5"></div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div>
          <h2 className="text-lg font-semibold font-poppins text-navy">Workflow Canvas</h2>
          <p className="text-sm text-gray-500 font-roboto">
            {components.length} component{components.length !== 1 ? 's' : ''} in workflow
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onPreview}
            className="border-cyan text-cyan hover:bg-cyan hover:text-white"
            disabled={components.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={onSave}
            className="gradient-primary hover:gradient-primary-hover"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        {components.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-blue to-cyan rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                <Settings className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 font-poppins">
                Start Building Your AI App
              </h3>
              <p className="text-gray-500 font-roboto leading-relaxed">
                Drag AI components from the sidebar to create your workflow. Connect them in sequence to build powerful AI applications.
              </p>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 p-4 bg-white/70 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-navy font-poppins mb-2">Workflow Execution Order</h4>
                <p className="text-sm text-gray-600 font-roboto">
                  Components will execute in the order shown below. Drag to reorder them.
                </p>
              </div>
              
              <Droppable droppableId="canvas">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {components.map((component, index) => (
                      <Draggable key={component.id} draggableId={component.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "mb-4 transition-all duration-200",
                              snapshot.isDragging && "scale-105 rotate-2 shadow-2xl"
                            )}
                          >
                            {renderComponent(component, index, provided.dragHandleProps)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="font-medium text-green-800 font-poppins">Workflow Complete</span>
                </div>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

// Component Icon helper
function ComponentIcon({ type }: { type: string }) {
  const iconProps = { className: "h-4 w-4 text-white" };
  
  switch (type) {
    case 'chatbot':
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
          <MessageSquare {...iconProps} />
        </div>
      );
    case 'text-analysis':
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center">
          <BarChart3 {...iconProps} />
        </div>
      );
    case 'image-generation':
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center">
          <Image {...iconProps} />
        </div>
      );
    case 'data-processor':
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
          <Cpu {...iconProps} />
        </div>
      );
    case 'api-call':
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center">
          <Zap {...iconProps} />
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded flex items-center justify-center">
          <Settings {...iconProps} />
        </div>
      );
  }
}

// Component Preview helper
function ComponentPreview({ component }: { component: CanvasComponent }) {
  const { type, config } = component;
  
  switch (type) {
    case 'chatbot':
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 font-roboto">AI Chatbot</div>
          <div className="text-xs text-gray-500">
            Model: {config.model || 'GPT-3.5-turbo'}
          </div>
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            System: {config.systemPrompt || 'Default AI assistant behavior'}
          </div>
        </div>
      );
    
    case 'text-analysis':
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 font-roboto">Text Analysis</div>
          <div className="text-xs text-gray-500">
            Analysis: {config.analysisType || 'Sentiment Analysis'}
          </div>
          <div className="text-xs text-gray-500">
            Language: {config.language || 'Auto-detect'}
          </div>
        </div>
      );
    
    case 'image-generation':
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 font-roboto">Image Generation</div>
          <div className="text-xs text-gray-500">
            Style: {config.style || 'Realistic'}
          </div>
          <div className="text-xs text-gray-500">
            Size: {config.size || '512x512'}
          </div>
        </div>
      );
    
    case 'data-processor':
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 font-roboto">Data Processor</div>
          <div className="text-xs text-gray-500">
            Operation: {config.operation || 'Transform data'}
          </div>
          <div className="text-xs text-gray-500">
            Format: {config.outputFormat || 'JSON'}
          </div>
        </div>
      );
    
    case 'api-call':
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 font-roboto">API Call</div>
          <div className="text-xs text-gray-500">
            Method: {config.method || 'POST'}
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-1 rounded font-mono">
            {config.url || 'https://api.example.com/endpoint'}
          </div>
        </div>
      );
    
    default:
      return (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 font-roboto">Custom Component</div>
          <div className="text-xs text-gray-500">Type: {type}</div>
        </div>
      );
  }
}