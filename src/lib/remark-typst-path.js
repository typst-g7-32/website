import { visit } from 'unist-util-visit';

export default function remarkTypstPath(options = {}) {
  const { contentDir = 'content/docs' } = options;

  return (tree, file) => {
    if (!file?.path) {
      return;
    }

    let relativePath = file.path;
    const contentIndex = relativePath.indexOf(contentDir);
    
    if (contentIndex !== -1) {
      relativePath = relativePath.substring(contentIndex + contentDir.length + 1);
      relativePath = relativePath.replace(/\.(mdx|md)$/, '');
    }

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'TypstRender') {
        const imageAttr = node.attributes?.find(attr => attr.name === 'image');

        if (!imageAttr || !imageAttr.value) {
          return;
        }

        const imageName = imageAttr.value;

        if (typeof imageName === 'string' && !imageName.startsWith('/')) {
          const fullImagePath = relativePath 
            ? `/docs/attachments/${relativePath}/${imageName}`
            : `/docs/attachments/${imageName}`;

          if (!node.attributes) {
            node.attributes = [];
          }

          const existingFilePath = node.attributes.findIndex(
            attr => attr.name === 'filePath'
          );

          if (existingFilePath >= 0) {
            node.attributes[existingFilePath].value = fullImagePath;
          } else {
            node.attributes.push({
              type: 'mdxJsxAttribute',
              name: 'filePath',
              value: fullImagePath,
            });
          }
        }
      }
    });
  };
}
