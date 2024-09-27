import Image from "next/image";
import { client } from "@/sanity/lib/client";

// Define the metadata for this dynamic route using the Metadata API
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch the success story (course) based on the slug
  const query = `*[_type=="sucess" && slug.current == $slug][0]{
    title,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }`;
  
  const course = await client.fetch(query, { slug });

  if (!course) {
    return {
      title: "Course not found",
      description: "Course details are unavailable."
    };
  }

  const imageUrl = course.imageUrl || "/default-image.jpg";

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      url: `https://www.galaxyeducation.org/success/${course.slug}`,
      images: [{ url: imageUrl }], // Corrected to be an object with "url"
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [{ url: imageUrl }], // Corrected to be an object with "url"
    },
    other: {
      'pinterest:title': course.title,
      'pinterest:description': course.description,
      'pinterest:image': imageUrl,
    },
  };
}

export async function generateStaticParams() {
  const query = `*[_type=='sucess']{
    "slug": slug.current
  }`;
  const slugs = await client.fetch(query);
  return slugs.map((item) => ({ slug: item.slug }));
}

// To create static pages for dynamic routes
export default async function Page({ params }) {
  const { slug } = params;

  // Fetching the course based on the slug
  const query = `*[_type=="sucess" && slug.current == $slug]{
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    title
  }[0]`; // Fetch only the first matching document

  const course = await client.fetch(query, { slug });

  // Check if course data is null or undefined
  if (!course) {
    return <div className="text-center">Course not found</div>;
  }

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8 items-center text-dark dark:text-light">
      {/* Blog Title */}
      <h1 className="text-3xl lg:text-5xl font-bold mb-8">
        {course.title || "No title available"}
      </h1>

      {/* Featured Image */}
      {course.imageUrl ? (
        <div className="w-full max-w-4xl">
          <Image
            src={course.imageUrl}
            width={1300}
            height={500}
            alt={course.title || "Course image"}
            className="rounded w-full object-cover"
          />
        </div>
      ) : (
        <p>No image available</p>
      )}

      {/* Blog Summary Section */}
      <section className="text-center w-full max-w-4xl">
        <h2 className="text-xl xs:text-2xl md:text-3xl font-bold uppercase text-accentDarkPrimary mb-4">
          Summary
        </h2>
        <p className="text-base md:text-xl leading-relaxed text-justify text-dark/80 dark:text-light/80">
          {course.description || "No description available"}
        </p>
      </section>
    </article>
  );
}
