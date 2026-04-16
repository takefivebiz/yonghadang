export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">용하당</h1>
        <p className="text-muted-foreground text-center text-lg">
          프로젝트가 성공적으로 설정되었습니다.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Docs
          </a>
          <a
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </a>
        </div>
      </main>
    </div>
  );
}
