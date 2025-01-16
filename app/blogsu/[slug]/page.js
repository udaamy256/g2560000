import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image"; // Import urlFor to generate image URLs
import { notFound } from "next/navigation";

export const revalidate = 60; // Revalidate every 60 seconds

// Fetch the dynamic params for static generation
export async function generateStaticParams() {
  const query = `*[_type=='sucess']{
    "slug": slug.current
  }`;
  const slugs = await client.fetch(query);
  return slugs.map((item) => ({ slug: item.slug }));
}

// Generate metadata dynamically from Sanity for each page
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch the course data based on the slug
  const query = `*[_type=="sucess" && slug.current == $slug][0]{
    title,
    description,
    "slug": slug.current,
    image
  }`;

  const course = await client.fetch(query, { slug });

  if (!course) {
    return {
      title: "Course not found",
      description: "Course details are unavailable.",
    };
  }

  // Generate image URL from Sanity's image or fallback to a default image
  const imageUrl = course.image
    ? urlFor(course.image).width(1200).height(630).url() // Optimal dimensions for social sharing
    : "https://www.galaxyeducation.org/default-image.jpg"; // Fallback if no image is found

  return {
    title: `${course.title} | Study Visa Consultant`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      url: `https://www.galaxyeducation.org/blogsu/${course.slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    other: {
      'pinterest:title': course.title,
      'pinterest:description': course.description,
      'pinterest:image': imageUrl,
    },
  };
}

// Page component to render course details
export default async function Page({ params }) {
  const { slug } = params;

  // Fetching the course details from Sanity
  const query = `*[_type=="sucess" && slug.current == $slug][0]{
    description,
    "slug": slug.current,
    image,
    title
  }`;

  const course = await client.fetch(query, { slug });

  // If the course is not found, render a 404 page
  if (!course) {
    return (
      <div className="text-center">
        <h1 className="text-3xl lg:text-5xl font-bold mb-8">404 - Course Not Found</h1>
        <p>Sorry, the course you are looking for does not exist.</p>
      </div>
    );
  }

  // Dynamically generate the image URL using urlFor from Sanity
  const imageUrl = course.image
    ? urlFor(course.image).url()
    : "https://www.galaxyeducation.org/default-image.jpg"; // Fallback image

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8 items-center text-dark dark:text-light">
      {/* Course Title */}
      <h1 className="text-3xl lg:text-5xl font-bold mb-8">
        {course.title || "No title available"}
      </h1>

      {/* Featured Image */}
      {imageUrl && (
        <div className="w-full max-w-4xl">
          <Image
            src={imageUrl}
            width={1300}
            height={500}
            alt={course.title || "Course image"}
            className="rounded w-full object-cover"
            loading="lazy" // Lazy loading for performance optimization
          />
        </div>
      )}

      {/* Course Summary Section */}
      <section className="py-12 px-8 text-center w-full max-w-4xl mx-auto bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">Success Spotlight
</h2>
        <p className="text-white text-lg md:text-2xl leading-relaxed">
          {course.description || "No description available"}
        </p>
      </section>
    </article>
  );
}
