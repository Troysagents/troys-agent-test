import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Web Search Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <iframe 
        src="/search.html" 
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          position: 'fixed',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}
