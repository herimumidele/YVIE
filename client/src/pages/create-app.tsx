import { useParams, useLocation } from "wouter";
import AppBuilder from "@/components/app-builder/app-builder";

export default function CreateApp() {
  const params = useParams();
  const [location] = useLocation();
  const appId = params.id ? parseInt(params.id) : undefined;
  const isNewApp = !appId;
  
  // Extract template ID from query parameters
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const templateId = urlParams.get('template') ? parseInt(urlParams.get('template')!) : undefined;

  return (
    <AppBuilder 
      appId={appId}
      isNewApp={isNewApp}
      templateId={templateId}
    />
  );
}