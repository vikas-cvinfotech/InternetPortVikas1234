export default function CategoryPageLayout({ children }) {
  return (
    <div className="bg-primary">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-16">
        {children}
      </main>
    </div>
  );
}
