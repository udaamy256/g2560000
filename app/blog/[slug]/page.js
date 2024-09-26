import Image from "next/image";
import { client } from "@/sanity/lib/client";
import VisitCourseButton from "@/components/button/page";

export const revalidate = 60; // seconds

export async function generateStaticParams() {
  const query = `*[_type=='course']{
    "slug": slug.current
  }`;
  const slugs = await client.fetch(query);
  return slugs.map((item) => ({ slug: item.slug }));
}

// To create static pages for dynamic routes
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch the course based on the slug
  const query = `*[_type=="course" && slug.current == $slug]{
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    title
  }[0]`;

  const course = await client.fetch(query, { slug });

  // Fallback for Open Graph image
  const ogImageUrl = course.imageUrl || "https://www.galaxyeducation.org/default-image.png";

  return {
    title: `${course.title} | Study Visa Consultant`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      url: `https://www.galaxyeducation.org/course/${course.slug}`,
      images: [{ url: ogImageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [ogImageUrl],
    },
    other: {
      'pinterest:title': course.title,
      'pinterest:description': course.description,
      'pinterest:image': ogImageUrl,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = params;

  // Fetching the course based on the slug
  const query = `*[_type=="course" && slug.current == $slug]{
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    title,
    href
  }[0]`; // Fetch only the first matching document

  const course = await client.fetch(query, { slug });

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8 items-center text-dark dark:text-light">
      {/* Blog Title */}
      <h1 className="text-3xl lg:text-5xl font-bold mb-8">
        {course.title}
      </h1>

      <section className="mt-8 flex justify-center">
        <VisitCourseButton href={course.href} />
      </section>

      {/* Featured Image */}
      {course.imageUrl && (
        <div className="w-full max-w-4xl">
          <Image
            src={course.imageUrl}
            width={1300}
            height={500}
            alt={course.title || "Course image"}
            className="rounded w-full object-cover"
          />
        </div>
      )}

      {/* Blog Summary Section */}
      <section className="text-center w-full max-w-4xl">
        <h2 className="text-xl xs:text-2xl md:text-3xl font-bold uppercase text-accentDarkPrimary mb-4">
          Summary
        </h2>
        <p className="text-base md:text-xl leading-relaxed text-justify text-dark/80 dark:text-light/80">
          {course.description}
        </p>
      </section>

      {/* Centered Button */}
      <section className="mt-8 flex justify-center">
        <VisitCourseButton href={course.href} />
      </section>
    </article>
  );
}
