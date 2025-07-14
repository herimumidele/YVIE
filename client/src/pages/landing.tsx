import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  ArrowRight, 
  Play,
  Check,
  Globe,
  Cpu,
  Database,
  MessageSquare,
  Image,
  BarChart3,
  Workflow
} from "lucide-react";
import yvieLogoPath from "@assets/download (1)_1751149239584.png";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <img src={yvieLogoPath} alt="YVIE AI Logo" className="h-8 w-auto" />
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#integrations" className="text-gray-300 hover:text-white transition-colors">Integrations</a>
                <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogin} className="text-gray-300 hover:text-white">
                Log in
              </Button>
              <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="mb-8">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
              Build AI apps in minutes, with no-code
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build AI apps in
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text block">
              minutes, with no-code
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create powerful AI applications without writing a single line of code. 
            Drag, drop, and deploy with YVIE's intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
              Start building for free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4">
              <Play className="mr-2 w-5 h-5" />
              Watch demo
            </Button>
          </div>
          
          {/* Hero Image/Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-2xl">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="grid grid-cols-12 gap-4 h-64">
                  <div className="col-span-3 bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Components</div>
                    <div className="space-y-2">
                      {['Chatbot', 'Image Gen', 'Text Analysis', 'Data Processor'].map((item) => (
                        <div key={item} className="bg-gray-600 rounded p-2 text-xs text-gray-300">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-6 bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Canvas</div>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Drag & Drop Interface</div>
                    </div>
                  </div>
                  <div className="col-span-3 bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Properties</div>
                    <div className="space-y-2">
                      <div className="bg-gray-600 rounded p-2 text-xs text-gray-300">Settings</div>
                      <div className="bg-gray-600 rounded p-2 text-xs text-gray-300">Config</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">YVIE FEATURES</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale AI applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Workflow className="w-8 h-8" />,
                title: "Visual Workflow Builder",
                description: "Create complex AI workflows with simple drag-and-drop interface"
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "AI Chatbots",
                description: "Build intelligent conversational interfaces in minutes"
              },
              {
                icon: <Image className="w-8 h-8" />,
                title: "Image Generation",
                description: "Integrate AI image creation into your applications"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Analytics Dashboard",
                description: "Monitor performance and user engagement in real-time"
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Data Processing",
                description: "Transform and analyze data with AI-powered tools"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "One-Click Deploy",
                description: "Deploy your apps to the cloud with a single click"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Multiple LLM Integration */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Multiple LLM Integration</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Connect with leading AI models and services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'OpenAI', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Cohere'
            ].map((provider, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-white font-medium">{provider}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YVIE Chat Engine */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">YVIE Chat Engine</h2>
              <p className="text-gray-400 text-lg mb-8">
                Advanced conversational AI that understands context, maintains memory, 
                and provides human-like interactions for your applications.
              </p>
              <div className="space-y-4">
                {[
                  'Context-aware conversations',
                  'Multi-turn dialogue support',
                  'Custom personality training',
                  'Real-time response streaming'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-300 text-sm">
                        Hello! I'm your AI assistant. How can I help you build your app today?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600/20 rounded-lg p-4 ml-8">
                  <div className="text-gray-300 text-sm">
                    I want to create a chatbot for customer support
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-300 text-sm">
                        Great! I'll help you set up a customer support chatbot. Let me create the components you'll need...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">YVIE Community</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of developers building the future of AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Share & Discover",
                description: "Explore templates and apps built by the community",
                count: "10k+ Templates"
              },
              {
                title: "Get Support",
                description: "Connect with other developers and get help",
                count: "24/7 Support"
              },
              {
                title: "Learn & Grow",
                description: "Access tutorials, guides, and best practices",
                count: "500+ Tutorials"
              }
            ].map((item, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{item.count}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={yvieLogoPath} alt="YVIE AI Logo" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400">
                Build AI applications without code. The future of no-code AI development.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#integrations" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#community" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YVIE AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}