import { notFound } from 'next/navigation';
import { getExampleById, getAllExamples } from '@/data/examples';
import ExampleDetailView from '@/components/examples/detail-view';

interface ExampleDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const examples = getAllExamples();
  return examples.map((example) => ({
    id: example.id,
  }));
}

export async function generateMetadata({ params }: ExampleDetailPageProps) {
  const { id } = await params;
  const example = getExampleById(id);
  
  if (!example) {
    return {
      title: 'Превью не найдено | Typst ГОСТ',
    };
  }

  return {
    title: `${example.title} | Typst ГОСТ`,
    description: `Просмотр примера: ${example.title}`,
  };
}

export default async function ExampleDetailPage({ params }: ExampleDetailPageProps) {
  const { id } = await params;
  const example = getExampleById(id);

  if (!example) {
    notFound();
  }

  return <ExampleDetailView example={example} />;
}
