export interface ExampleItem {
  id: string;                    // Уникальный идентификатор
  title: string;                 // Название (для страницы превью)
  pdfUrl: string;               // Ссылка на PDF в GitHub
  pngUrl: string;               // Ссылка на PNG в GitHub  
  codeUrl: string;              // Raw URL ссылка на код
  showOnHomepage: boolean;       // Показывать на главной странице
}
