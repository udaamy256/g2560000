"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { client } from "@/sanity/lib/client"; // Import Sanity client
import { urlFor } from "@/sanity/lib/image"; // Import urlFor for image URLs

const HomePage1 = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch blog data from Sanity when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const query = `
        *[_type == "blog"]{
          title,
          slug,
          description,
          image,
          slideshow[]{
            asset->{
              _id,
              url
            },
            alt
          }
        }[0...1] // Fetch only the first blog
      `;
      const result = await client.fetch(query);
      setBlogs(result);
    };

    fetchData().catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fallback if no blogs are found
  if (!blogs || blogs.length === 0) {
    return <div>No blogs available</div>;
  }

  // Use the first blog for the cover and slideshow
  const blog = blogs[0];

  // Prepare slideshow images (limit to 3 images)
  const slideshowImages = blog.slideshow
    ? blog.slideshow.slice(0, 10).map((image) => urlFor(image.asset).url())
    : [];

  // Slider settings with autoplay enabled
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        // Enables automatic sliding
    autoplaySpeed: 1500,   // Changes images every 3 seconds
  };

  return (
    <main>
    
      {/* Slideshow Section */}
      <section className="my-10 mx-5 sm:mx-10">
        {slideshowImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {slideshowImages.map((imageUrl, index) => (
              <div key={index} className="relative h-[60vh] sm:h-[80vh]">
                <Image
                  src={imageUrl}
                  alt={`Slider image ${index + 1}`}
                  fill // Makes the image fill the parent container
                  className="object-center object-cover rounded-3xl -z-10" // Styling classes
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive sizes for optimization
                  priority // Improves LCP by prioritizing the first image load
                  placeholder="blur"
                  blurDataURL={imageUrl}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No slideshow images available</p>
        )}
      </section>
    </main>
  );
};

export default HomePage1;
