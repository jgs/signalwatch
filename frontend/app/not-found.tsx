export default function NotFound() {
  return (
    <main className="min-h-screen bg-signal-black p-8 text-signal-text">
      <div className="console-panel max-w-xl p-6">
        <div className="font-mono text-[0.72rem] uppercase text-signal-green">signalwatch / route monitor</div>
        <h1 className="mt-6 text-xl font-semibold">route not observed</h1>
        <p className="mt-4 text-sm text-signal-muted">The requested console surface is not registered in this deployment.</p>
      </div>
    </main>
  );
}

