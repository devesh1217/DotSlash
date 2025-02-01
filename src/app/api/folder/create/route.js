import { NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/googleDrive';

export async function POST(request) {
  try {
    const { folderName, parentFolderId } = await request.json();

    if (!folderName) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    const googleDrive = new GoogleDriveService();
    const result = await googleDrive.createFolder(folderName, parentFolderId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Folder creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Folder creation failed' },
      { status: 500 }
    );
  }
}
