export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(242,109,91,0.24)_0%,_rgba(242,109,91,0)_72%)] blur-2xl" />
        <div className="absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(248,161,133,0.22)_0%,_rgba(248,161,133,0)_72%)] blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.6)_0%,_rgba(255,255,255,0)_70%)] blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
