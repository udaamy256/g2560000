import Image from "next/image";
import { client } from "@/sanity/lib/client";
import VisitCourseButton from "@/components/button/page";
import { urlFor } from "@/sanity/lib/image"; // Import urlFor to generate image URLs

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const query = `*[_type=='course']{
    "slug": slug.current
  }`;
  const slugs = await client.fetch(query);
  return slugs.map((item) => ({ slug: item.slug }));
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch the course based on the slug
  const query = `*[_type=="course" && slug.current == $slug]{
    description,
    "slug": slug.current,
    image,
    title
  }[0]`;

  const course = await client.fetch(query, { slug });

  if (!course) {
    return {
      title: "Course not found",
      description: "Course details are unavailable.",
    };
  }

  // Generate the image URL dynamically using urlFor and ensure proper dimensions
  const ogImageUrl = course.image ? urlFor(course.image).width(1200).height(630).url() : "";

  return {
    title: `${course.title} | Study Visa Consultant`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      url: `https://www.galaxyeducation.org/course/${course.slug}`,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [], // Ensure correct image dimensions
      type: 'article', // Set Open Graph type as 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    other: {
      'pinterest:title': course.title,
      'pinterest:description': course.description,
      'pinterest:image': ogImageUrl ? ogImageUrl : "",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = params;

  // Fetch the course based on the slug
  const query = `*[_type=="course" && slug.current == $slug][0]{
    description,
    "slug": slug.current,
    image,
    title,
    href
  }`;

  const course = await client.fetch(query, { slug });

  // Check if course data is null or undefined
  if (!course) {
    return <div className="text-center">Course not found</div>;
  }

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8 items-center text-dark dark:text-light">
      {/* Course Title */}
      <h1 className="text-3xl lg:text-5xl font-bold mb-8">
        {course.title}
      </h1>

      {/* Visit Course Button */}
      <section className="mt-8 flex justify-center">
        <VisitCourseButton href={course.href} />
      </section>

      {/* Course Image */}
      {course.image && (
        <div className="w-full max-w-4xl">
          <Image
            src={urlFor(course.image).width(1200).height(630).url()} // Ensure image dimensions are suitable for social preview
            width={1200}
            height={630}
            alt={course.title || "Course image"}
            className="rounded w-full object-cover"
          />
        </div>
      )}

      {/* Course Summary Section */}
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
