import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

import { DEFAULT_HIDDEN_PREFIX, DEFAULT_HIDDEN_SUFFIX } from '../lib/typst/constants.js';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');
const OUTPUT_BASE = path.join(process.cwd(), 'public/docs/attachments');

const TYPST_RENDER_REGEX = /<TypstRender\s+([^>]+?)\/>/gs;

let compiler = null;

async function getCompiler() {
  if (compiler) {
    return compiler;
  }

  compiler = NodeCompiler.create();

  return compiler;
}

function buildFullCode(code, hiddenPrefix, hiddenSuffix) {
  const prefix = hiddenPrefix || '';
  const suffix = hiddenSuffix || '';
  return `${prefix}${code}${suffix}`;
}

async function compileTypstToImage(typstCode, outputPath) {
  try {
    const currentCompiler = await getCompiler();

    const svgOutput = await currentCompiler.svg({
      mainFileContent: typstCode,
    });

    await sharp(Buffer.from(svgOutput), { density: 500 })
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

function parseTypstRenderProps(propsString) {
  const props = {};

  // Извлекаем code={`...`}
  const codeMatch = propsString.match(/code=\{`((?:[^`\\]|\\.|`(?!}))+)`\}/s);
  if (codeMatch) {
    props.code = codeMatch[1]
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\`/g, '`');
  }

  // Извлекаем image="..."
  const imageMatch = propsString.match(/image=["']([^"']+)["']/);
  if (imageMatch) {
    props.image = imageMatch[1];
  }

  // Извлекаем hiddenPrefix={`...`} или hiddenPrefix={null}
  const prefixMatch = propsString.match(/hiddenPrefix=\{(?:`((?:[^`\\]|\\.|`(?!}))+)`|(null))\}/s);
  if (prefixMatch) {
    if (prefixMatch[2] === 'null') {
      props.hiddenPrefix = null;
    } else if (prefixMatch[1]) {
      props.hiddenPrefix = prefixMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\`/g, '`');
    }
  } else {
    props.hiddenPrefix = DEFAULT_HIDDEN_PREFIX;
  }

  // Извлекаем hiddenSuffix={`...`} или hiddenSuffix={null}
  const suffixMatch = propsString.match(/hiddenSuffix=\{(?:`((?:[^`\\]|\\.|`(?!}))+)`|(null))\}/s);
  if (suffixMatch) {
    if (suffixMatch[2] === 'null') {
      props.hiddenSuffix = null;
    } else if (suffixMatch[1]) {
      props.hiddenSuffix = suffixMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\`/g, '`');
    }
  } else {
    props.hiddenSuffix = DEFAULT_HIDDEN_SUFFIX;
  }

  return props;
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
    const propsString = matches[i][1];
    const props = parseTypstRenderProps(propsString);
    
    if (!props.code || !props.image) {
      console.warn(`  Skipping component ${i + 1}: missing code or image`);
      continue;
    }

    const fullCode = buildFullCode(props.code, props.hiddenPrefix, props.hiddenSuffix);
    
    const outputPath = path.join(outputDir, props.image);

    const success = await compileTypstToImage(fullCode, outputPath);
    if (!success) {
      console.warn(`  Skipping: ${props.image}`);
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
