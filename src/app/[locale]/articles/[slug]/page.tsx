interface PageProps {
    params: {
      slug: string;
    };
  }
  
  export default function Page({ params }: PageProps) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">
          Halaman artikel: {params.slug}
        </h1>
        <p className="mt-4 text-gray-600">
          Ini adalah halaman starter untuk artikel dengan slug <b>{params.slug}</b>.
        </p>
      </main>
    );
  }
  