import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');
const OUTPUT_BASE = path.join(process.cwd(), 'public/docs/attachments');


const TYPST_RENDER_REGEX = /<TypstRender[\s\S]*?code=\{`([\s\S]*?)`[\s\S]*?image=["']([^"']+)["'][\s\S]*?\/>/g;

let compiler = null;

async function getCompiler() {
  if (compiler) {
    return compiler;
  }

  compiler = NodeCompiler.create();

  return compiler;
}

async function compileTypstToImage(typstCode, outputPath) {
  try {
    const currentCompiler = await getCompiler();

    const svgOutput = await currentCompiler.svg({
      mainFileContent: typstCode,
    });

    await sharp(Buffer.from(svgOutput), { density: 300 })
      .png()
      .toFile(outputPath);

    console.log(`✓ Compiled: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to compile ${outputPath}:`);
    console.log(error);
    return false;
  }
}

async function processDirectory(dir, relativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const newRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath, newRelativePath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      await processMdxFile(fullPath, newRelativePath);
    }
  }
}

async function processMdxFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = [...content.matchAll(TYPST_RENDER_REGEX)];

  if (matches.length === 0) return;

  console.log(`\nProcessing: ${relativePath}`);

  const fileNameWithoutExt = path.basename(relativePath, path.extname(relativePath));
  
  const outputDir = path.join(
    OUTPUT_BASE,
    path.dirname(relativePath),
    fileNameWithoutExt
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < matches.length; i++) {
    let typstCode = matches[i][1];
    const imageName = matches[i][2];

    console.log(imageName);
    
    const outputPath = path.join(outputDir, imageName);

    const success = await compileTypstToImage(typstCode, outputPath);
    if (!success) {
      console.warn(`  Skipping: ${imageName}`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Typst compilation...\n');
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const startTime = Date.now();
  
  try {
    await processDirectory(CONTENT_DIR);
    
    const endTime = Date.now();
    console.log(`\n✨ Compilation completed in ${(endTime - startTime) / 1000}s`);
  } catch (error) {
    console.error('\n❌ Compilation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
