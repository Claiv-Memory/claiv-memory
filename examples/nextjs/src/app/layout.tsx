export const metadata = {
  title: 'Claiv Memory × Next.js',
  description: 'AI chatbot with persistent cross-session memory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fafafa' }}>{children}</body>
    </html>
  );
}
