import Image from "next/image";
import BlogDetails from "@/components/blogdetail/page";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

// Use the Metadata API for handling meta tags and SEO
export async function generateMetadata({ params }) {
  if (!params?.slug) {
    notFound();
    return null;
  }

  // Fetch the blog data from Sanity
  const query = `
    *[_type == "blog" && slug.current == $slug][0]{
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

  // Generate the image URL using urlFor from Sanity
  const imageUrl = blog.image ? urlFor(blog.image).url() : null;

  // Generate metadata for Open Graph and Twitter
  return {
    title: blog.title || "No title available",
    description: blog.description || "No description available",
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://www.galaxyeducation.org/blog/${params.slug}`,
      images: imageUrl ? [{ url: imageUrl }] : [], // Ensure that this field is filled properly
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
  if (!params?.slug) {
    notFound();
    return null;
  }

  // Fetch the blog data from Sanity
  const query = `
    *[_type == "blog" && slug.current == $slug][0]{
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

  // Extract headings for Table of Contents
  const headings = [];
  if (blog.heading1) {
    headings.push({ text: blog.heading1, slug: "heading-1", level: "1" });
  }
  if (blog.heading2) {
    headings.push({ text: blog.heading2, slug: "heading-2", level: "2" });
  }

  // Extract additional headings from content
  if (blog.content && Array.isArray(blog.content)) {
    blog.content.filter(block => block.style && block.style.match(/^h[1-6]$/))
      .forEach((heading, index) => {
        const level = heading.style.replace('h', ''); // Extract the heading level
        const text = heading.children.map(child => child.text).join("");
        headings.push({
          text,
          slug: `content-heading-${index}`,
          level,
        });
      });
  }

  // Dynamically generate image URL using urlFor from Sanity
  const imageUrl = blog.image ? urlFor(blog.image).url() : null;

  return (
    <article>
      <div className="mb-8 text-center relative w-full h-[70vh] bg-gray-800">
        <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="inline-block mt-6 font-semibold capitalize text-white text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6">
            {blog.title}
          </h1>
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
  );
}
