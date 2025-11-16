#!/usr/bin/env python3
import os
from pathlib import Path
from pypdf import PdfReader, PdfWriter

def extract_gost_name(filename):
    """Извлекает название ГОСТа из имени файла"""
    name = filename.replace('.pdf', '')
    name = name.replace('gost-', 'ГОСТ ')
    name = name.upper()
    
    return name

def update_pdf_title(file_path):
    """Обновляет title в метаданных PDF"""
    try:
        reader = PdfReader(file_path)
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        filename = os.path.basename(file_path)
        title = extract_gost_name(filename)
        if reader.metadata:
            writer.add_metadata(reader.metadata)
        
        writer.add_metadata({
            '/Title': title
        })
        temp_path = file_path + '.tmp'
        with open(temp_path, 'wb') as output_file:
            writer.write(output_file)
        os.replace(temp_path, file_path)
        
        print(f"✓ {filename} -> {title}")
        return True
        
    except Exception as e:
        print(f"✗ Ошибка при обработке {file_path}: {e}")
        return False

def process_directory(directory_path):
    """Обрабатывает все PDF-файлы в директории"""
    directory = Path(directory_path)
    
    if not directory.exists():
        print(f"Директория {directory_path} не найдена!")
        return
    
    pdf_files = list(directory.glob('*.pdf'))
    
    if not pdf_files:
        print("PDF-файлы не найдены!")
        return
    
    print(f"Найдено файлов: {len(pdf_files)}\n")
    
    success_count = 0
    for pdf_file in pdf_files:
        if update_pdf_title(str(pdf_file)):
            success_count += 1
    
    print(f"\nГотово! Обработано: {success_count}/{len(pdf_files)}")

if __name__ == '__main__':
    directory = './public/documents'
    process_directory(directory)
