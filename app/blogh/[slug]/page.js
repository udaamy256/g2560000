import BlogDetails from "@/components/blogdetail/page";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

// Generate metadata with proper Open Graph and Twitter tags
export async function generateMetadata({ params }) {
  if (!params?.slug) {
    notFound();
    return null;
  }

  // Fetch blog data from Sanity
  const query = `
    *[_type == "uni" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      image,
      publishedAt
    }
  `;
  const blog = await client.fetch(query, { slug: params.slug });

  if (!blog) {
    notFound();
    return null;
  }

  // Generate image URL if available
  const imageUrl = blog.image ? urlFor(blog.image).url() : null;

  // Ensure that the correct Open Graph and Twitter metadata is returned
  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://www.galaxyeducation.org/blog/${params.slug}`,
      type: 'article',
      ...(imageUrl && { images: [{ url: imageUrl }] }), // Include image if it exists
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      ...(imageUrl && { images: [imageUrl] }), // Include image if it exists
    },
    other: {
      'pinterest:title': blog.title,
      'pinterest:description': blog.description,
      ...(imageUrl && { 'pinterest:image': imageUrl }), // Include image if it exists
    },
  };
}

export default async function BlogPage({ params }) {
  if (!params?.slug) {
    notFound();
    return null;
  }

  // Fetch the blog data from Sanity
  const query = `
    *[_type == "uni" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      image,
      publishedAt,
      content,
      heading1,
      heading2
    }
  `;
  
  const blog = await client.fetch(query, { slug: params.slug });

  if (!blog) {
    notFound();
    return null;
  }

  // Generate image URL only if blog.image exists
  const imageUrl = blog.image ? urlFor(blog.image).url() : null;

  // Handle table of contents (TOC) headings
  const headings = [];
  if (blog.heading1) {
    headings.push({ text: blog.heading1, slug: "heading-1", level: "1" });
  }
  if (blog.heading2) {
    headings.push({ text: blog.heading2, slug: "heading-2", level: "2" });
  }

  if (blog.content && Array.isArray(blog.content)) {
    blog.content
      .filter((block) => block.style && block.style.match(/^h[1-6]$/))
      .forEach((heading, index) => {
        const level = heading.style.replace('h', '');
        const text = heading.children.map((child) => child.text).join("");
        headings.push({
          text,
          slug: `content-heading-${index}`,
          level,
        });
      });
  }

  return (
    <>
      <article>
        <div className="mb-8 text-center relative w-full h-[70vh] bg-gray-800">
          <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="inline-block mt-6 font-semibold capitalize text-white text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6">
              {blog.title}
            </h1>
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-gray-800/60" />
          {blog.image && (
            <Image
              src={urlFor(blog.image).url()}
              alt={blog.title}
              fill
              className="aspect-square w-full h-full object-cover object-center"
              priority
              sizes="100vw"
            />
          )}
        </div>

        {/* Centered Description Section */}
        <section className="py-12 px-8 text-center w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Course Description
          </h2>
          <p className="text-white text-lg md:text-2xl leading-relaxed">
            {blog.description || "No description available"}
          </p>
        </section>

        <BlogDetails blog={blog} slug={params.slug} toc={headings} />
        
        <div className="grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10">
          <div className="col-span-12 lg:col-span-4">
            <details
              className="border-[1px] border-solid border-dark dark:border-light text-black dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto"
              open
            >
              <summary className="text-lg font-semibold capitalize cursor-pointer">
                Table Of Contents
              </summary>
              <ul className="mt-4 font-in text-base">
                {headings.length > 0 ? (
                  headings.map((heading) => (
                    <li key={heading.slug} className="py-1">
                      <a
                        href={`#${heading.slug}`}
                        data-level={heading.level}
                        className={`data-[level="1"]:pl-0 data-[level="2"]:pl-4
                                    data-[level="2"]:border-t border-solid border-dark/40
                                    data-[level="3"]:pl-8
                                    flex items-center justify-start
                                    hover:text-blue-500`}
                      >
                        {heading.level === "3" && (
                          <span className="flex w-1 h-1 rounded-full bg-dark dark:bg-light mr-2">
                            &nbsp;
                          </span>
                        )}
                        <span className="hover:underline">{heading.text}</span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No content available</li>
                )}
              </ul>
            </details>
          </div>

          <div className="col-span-12 lg:col-span-8 border-dark dark:border-light text-black dark:text-light">
            {blog.content ? <PortableText value={blog.content} /> : <p>No content available</p>}
          </div>
        </div>
      </article>
    </>
  );
}
