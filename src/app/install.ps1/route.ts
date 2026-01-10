import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'public', 'scripts', 'install.ps1');
    try {
        const fileContent = await readFile(filePath, 'utf8');
        return new Response(fileContent, {
            status: 200,
            headers: {
                'Content-Type': 'application/powershell; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (e) {
        return new Response('echo "Install script not found on the server"', {
            status: 404,
            headers: { 'Content-Type': 'application/powershell' }
        });
    }
}