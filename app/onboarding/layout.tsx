import { Logo } from "@/components/Logo";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Linke Seite - Content Container */}
      <div style={{ width: '66.666667%' }} className="bg-background">
        <div className="mx-auto h-full p-8">
          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>
          
          {/* Content Area */}
          <div className="flex items-center justify-center h-[calc(100%-5rem)]">
            <div className="formContent max-w-2xl w-full mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Rechte Seite - Teal Background & Image */}
      <div style={{ width: '33.333333%' }} className="bg-teal-500 h-[calc(100%-1rem)]">
        <div className="h-screen flex items-center justify-center p-12">
          <img 
            src="/images/onboarding.svg" 
            alt="Illustration" 
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </div>
  );
} 