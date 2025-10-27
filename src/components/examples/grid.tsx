import { ExampleItem } from '@/types/example';
import ExampleCard from './card';

interface ExampleGridProps {
  examples: ExampleItem[];
  showTitles?: boolean;
}

export default function ExampleGrid({ examples, showTitles = true }: ExampleGridProps) {
  if (examples.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Превью не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {examples.map((example) => (
        <ExampleCard
          key={example.id}
          example={example}
          showTitle={showTitles}
        />
      ))}
    </div>
  );
}
