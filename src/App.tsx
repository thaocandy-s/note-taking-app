import { TooltipProvider } from "./components/ui/tooltip";
import { Shell } from "./components/layout/Shell";
import { Sidebar } from "./components/sidebar/Sidebar";
import { EditorWorkspace } from "./components/editor/EditorWorkspace";

function App() {
  return (
    <TooltipProvider>
      <Shell>
        <Sidebar />
        <EditorWorkspace />
      </Shell>
    </TooltipProvider>
  );
}

export default App;
