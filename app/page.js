import dynamic from 'next/dynamic';
import HomePage from '@/components/maincomponent/page';
import Head from 'next/head'; // Import Head for manually adding meta tags

// Lazy load the Courses component
const Courses = dynamic(() => import('@/components/courses/page'), {
  loading: () => (
    <div style={{ minHeight: '300px', width: '100%' }}>
      <p>Loading courses...</p>
    </div>
  ),
  ssr: false, // Disable server-side rendering for better initial performance
});

export const metadata = {
  title: 'Study Visa Consultant | Home',
  description: 'Get the best study visa consultancy with the experts at Galaxy Education.',
  openGraph: {
    title: 'Study Visa Consultant',
    description: 'Explore courses and more with expert consultancy for your education abroad.',
    url: 'https://www.galaxyeducation.org',
    images: [
      {
        url: 'https://www.galaxyeducation.org/social-banner.png',
        width: 1200,
        height: 630,
        alt: 'Study Visa Consultant Social Banner',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Visa Consultant',
    description: 'Find the best courses for your education journey with expert consultants.',
    image: 'https://www.galaxyeducation.org/social-banner.png',
  },
};

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Head component for meta tags and Google AdSense verification */}
      <Head>
        <meta name="google-adsense-account" content="ca-pub-6998086632927114" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />
      </Head>

      {/* Home Page Section */}
      <div style={{ minHeight: '300px', width: '100%' }}>
        <HomePage />
      </div>

      {/* Lazy-loaded Courses Section */}
      <div style={{ minHeight: '300px', width: '100%' }}>
        <Courses />
      </div>
    </div>
  );
};

export default Page;
