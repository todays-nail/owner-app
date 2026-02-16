export interface SlotsViewProps {
  title: string;
  description: string;
}

export function SlotsView({ title, description }: SlotsViewProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
