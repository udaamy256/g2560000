import siteMetadata from "@/utils/siteMetaData";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import VisitCourseButton from "@/components/button/page";

// Use the Metadata API for handling meta tags and SEO
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch the blog data from Sanity for the "course" type
  const query = `
    *[_type == "course" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      image,
      href
    }
  `;

  const blog = await client.fetch(query, { slug });

  if (!blog) {
    notFound();
    return null;
  }

  // Ensure the image URL is available and meets Facebook's recommended dimensions (1200x630)
  const imageUrl = blog.image
    ? urlFor(blog.image).width(1200).height(630).url()
    : siteMetadata.socialBanner; // Fallback to the siteMetadata banner if no image is found

  // Return metadata with explicit og:image
  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://www.galaxyeducation.org/course/${slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [], // Explicitly provide the image URL and dimensions
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    other: {
      'pinterest:title': blog.title,
      'pinterest:description': blog.description,
      'pinterest:image': imageUrl,
    },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = params;

  // Fetch the blog data from Sanity
  const query = `
    *[_type == "course" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      image,
      href
    }
  `;

  const blog = await client.fetch(query, { slug });

  if (!blog) {
    notFound();
    return null;
  }

  // Dynamically generate image URL with recommended dimensions for Facebook
  const imageUrl = blog.image
    ? urlFor(blog.image).width(1200).height(630).url()
    : siteMetadata.socialBanner; // Fallback if no image is present

  // Render the page
  return (
    <article>
      <div className="mb-8 text-center relative w-full h-[70vh] bg-gray-800">
        <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Visit Course Button */}
          <section className="mt-8 flex justify-center">
            <VisitCourseButton href={blog.href} />
          </section>
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-gray-800/60" />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="aspect-square w-full h-full object-cover object-center"
            priority
            sizes="100vw"
          />
        )}
      </div>

      <section className="py-12 px-8 text-center w-full max-w-4xl mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">Course Summary</h2>
        <p className="text-white text-lg md:text-2xl leading-relaxed">
          {blog.description}
        </p>
      </section>

      {/* Centered Button */}
      <section className="mt-8 flex justify-center">
        <VisitCourseButton href={blog.href} />
      </section>
    </article>
  );
}
