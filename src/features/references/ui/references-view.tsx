export interface ReferencesViewProps {
  title: string;
  description: string;
}

export function ReferencesView({ title, description }: ReferencesViewProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
