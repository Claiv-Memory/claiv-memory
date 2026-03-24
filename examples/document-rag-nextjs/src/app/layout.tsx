export const metadata = {
  title: 'Claiv Memory × Document RAG',
  description: 'Upload documents and chat with them using Claiv Memory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fafafa' }}>{children}</body>
    </html>
  );
}
