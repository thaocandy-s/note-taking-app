import React, { useEffect, useState } from "react";
import { useNotesStore } from "../../store/useNotesStore";
import { Feather, Sparkles, BookOpen, Menu, X, EyeOff, Eye } from "lucide-react";
import { Button } from "../ui/button";

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { styleMode, setStyleMode, isFocusMode, setFocusMode } = useNotesStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync style mode with html attribute to trigger CSS Variable variables shifts
  useEffect(() => {
    document.documentElement.setAttribute("data-style-mode", styleMode);
  }, [styleMode]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-all duration-300">
      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Style Selector floating header */}
        <header className="absolute top-0 right-0 left-0 h-14 border-b border-border bg-card/80 backdrop-blur-md z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileSidebar}
              aria-label="Toggle Sidebar"
            >
              {mobileSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <h1 className="text-base font-bold tracking-tight select-none flex items-center gap-2">
              <span className="bg-primary text-primary-foreground size-6 rounded-md flex items-center justify-center text-xs font-black">N</span>
              NoteSpace
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Minimalist Focus Mode Toggle */}
            {styleMode === "minimalist" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFocusMode(!isFocusMode)}
                className="gap-1.5 text-xs h-8 px-2 md:px-3"
                title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
              >
                {isFocusMode ? (
                  <>
                    <Eye className="size-4" />
                    <span className="hidden sm:inline">Show Sidebar</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="size-4" />
                    <span className="hidden sm:inline">Focus Mode</span>
                  </>
                )}
              </Button>
            )}

            {/* Style Selector Tabs */}
            <div className="flex items-center bg-secondary p-0.5 rounded-lg border border-border">
              <button
                onClick={() => setStyleMode("minimalist")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  styleMode === "minimalist"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Minimalist Style"
              >
                <Feather className="size-3.5" />
                <span className="hidden md:inline">Minimalist</span>
              </button>
              <button
                onClick={() => setStyleMode("youthful")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  styleMode === "youthful"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Fun & Youthful Style"
              >
                <Sparkles className="size-3.5" />
                <span className="hidden md:inline">Youthful</span>
              </button>
              <button
                onClick={() => setStyleMode("knowledge")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  styleMode === "knowledge"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Knowledge Management Style"
              >
                <BookOpen className="size-3.5" />
                <span className="hidden md:inline">Knowledge</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Sidebar Container (handles mobile toggle and focus mode) */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-40 flex flex-col pt-14 border-r border-border bg-card
            transition-all duration-300 ease-in-out
            ${mobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
            ${isFocusMode && styleMode === "minimalist" ? "md:w-0 md:border-r-0 overflow-hidden" : "md:w-72 lg:w-80"}
          `}
        >
          {/* We will render children[0] (Sidebar) here */}
          <div className="flex-1 flex flex-col h-full min-w-[288px] overflow-hidden">
            {React.Children.toArray(children)[0]}
          </div>
        </aside>

        {/* Workspace Container */}
        <main className="flex-1 flex flex-col pt-14 overflow-hidden bg-background">
          {/* We will render children[1] (Workspace) here */}
          {React.Children.toArray(children)[1]}
        </main>
      </div>
    </div>
  );
};
