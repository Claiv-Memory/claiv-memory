import { ClaivClient } from '@claiv/memory';

const claiv = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY! });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string | null;
  const projectId = formData.get('projectId') as string | null;

  if (!file || !userId || !projectId) {
    return Response.json(
      { error: 'file, userId, and projectId are required' },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await claiv.uploadDocument({
    user_id: userId,
    project_id: projectId,
    filename: file.name,
    content_type: file.type || 'application/octet-stream',
    data: buffer.toString('base64'),
  });

  return Response.json(result);
}
