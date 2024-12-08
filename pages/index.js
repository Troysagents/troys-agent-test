import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Search Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{ padding: '20px' }}>
        <iframe 
          src="/search.html" 
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}