interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ message, description, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{message}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
}
