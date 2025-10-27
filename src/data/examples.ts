import { ExampleItem } from '@/types/example';

export const exampleItems: ExampleItem[] = [
  {
    id: 'main',
    title: 'Пример использования шаблона',
    pdfUrl: 'https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/preview/preview/preview/preview.pdf',
    pngUrl: 'https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/preview/preview/preview/preview.png',
    codeUrl: 'https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/main/documents/preview/main.typ',
    showOnHomepage: true,
  },
  {
    id: 'report',
    title: 'Лабораторная работа',
    pdfUrl: 'https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/preview/preview/databases-lab/databases-lab.pdf',
    pngUrl: 'https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/preview/preview/databases-lab/databases-lab.png',
    codeUrl: 'https://raw.githubusercontent.com/typst-g7-32/examples/refs/heads/main/documents/databases-lab/main.typ',
    showOnHomepage: false,
  },
];

export const getHomepageExample = (): ExampleItem | undefined => 
  exampleItems.find(item => item.showOnHomepage);

export const getAllExamples = (): ExampleItem[] => exampleItems;

export const getExampleById = (id: string): ExampleItem | undefined => 
  exampleItems.find(item => item.id === id);
