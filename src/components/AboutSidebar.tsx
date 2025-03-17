
import { useState } from "react";
import { X, Info } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AboutSidebarProps {
  title: string;
  content: string;
  tools?: string[];
}

export const AboutSidebar = ({ title, content, tools }: AboutSidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-3 rounded-full hover:bg-gray-800 transition-colors" aria-label="Open about section">
          <Info className="w-6 h-6 text-blue-400" />
        </button>
      </SheetTrigger>
      <SheetContent className="bg-[#1a1a1a] border-l border-gray-800 text-white">
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button 
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-300 text-lg mb-6">{content}</p>
          
          {tools && (
            <div className="mt-auto space-y-4">
              <p className="text-lg text-gray-400">My tools:</p>
              <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
                {tools.map((tool, index) => (
                  <li key={index}>{tool}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
