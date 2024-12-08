import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      <Head>
        <title>Web Search Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main style={{ height: '100%', width: '100%' }}>
        <iframe 
          src="/search.html" 
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0
          }}
        />
      </main>
    </div>
  );
}
