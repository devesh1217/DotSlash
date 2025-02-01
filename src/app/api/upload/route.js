import { NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/googleDrive';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    // const folderId = formData.get('folderId');
    const folderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.type) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    const googleDrive = new GoogleDriveService();
    const result = await googleDrive.uploadFile(file, folderId || null);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
