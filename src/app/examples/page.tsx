import { getAllExamples } from '@/data/examples';
import ExampleGrid from '@/components/examples/grid';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'Примеры',
  description: 'Галерея примеров документов по ГОСТ с использованием Typst modern-g7-32',
};

export default function ExamplePage() {
  const examples = getAllExamples();

  return (
    <div className="min-h-screen relative bg-linear-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto pt-24 sm:pt-28 md:pt-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Галерея примеров
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Изучите примеры документов, созданных с помощью библиотеки Typst ГОСТ. 
            Нажмите на любой пример, чтобы посмотреть код и PDF.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gray-800/50 border border-gray-800/50 rounded-3xl p-8 backdrop-blur-xs">
            <ExampleGrid examples={examples} />
          </div>
        </div>
      </div>
    </div>
  );
}
