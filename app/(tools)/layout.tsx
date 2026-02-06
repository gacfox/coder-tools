import ToolsSidebar from "./components/ToolsSidebar";

export default function ToolsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background overflow-hidden">
      <ToolsSidebar />
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-4xl mx-auto space-y-8">{children}</div>

        <div className="fixed top-1/4 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-1/4 -left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10" />
      </main>
    </div>
  );
}
