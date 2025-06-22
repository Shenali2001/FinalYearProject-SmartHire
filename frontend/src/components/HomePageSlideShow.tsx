// pages/index.tsx
"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const sections = [
  {
    id: "para1",
    title: "Paragraph 1",
    text: "This is the content of paragraph 1. It explains something important.I want to create a sideshow..that is, I want a paragraph on the left and an image related to the paragraph on the right. But when the paragraph is on the left, it can be scrolled. When scrolling, the image related to the paragraph should be on the right..For example, there are 4 paragraphs on the left. There is an image on the right..When the paragraph on the left is scrolled, the image related to the first ",
    image: "/images/CommonImages/homepage2.jpg",
  },
  {
    id: "para2",
    title: "Paragraph 2",
    text: "This is the content of paragraph 2. Here's more information.I want to create a sideshow..that is, I want a paragraph on the left and an image related to the paragraph on the right. But when the paragraph is on the left, it can be scrolled. When scrolling, the image related to the paragraph should be on the right..For example, there are 4 paragraphs on the left. There is an image on the right..When the paragraph on the left is scrolled, the image related to the first ",
    image: "/images/CommonImages/homepage1.jpg",
  },
  {
    id: "para3",
    title: "Paragraph 3",
    text: "This is the content of paragraph 3. Another interesting factI want to create a sideshow..that is, I want a paragraph on the left and an image related to the paragraph on the right. But when the paragraph is on the left, it can be scrolled. When scrolling, the image related to the paragraph should be on the right..For example, there are 4 paragraphs on the left. There is an image on the right..When the paragraph on the left is scrolled, the image related to the first .",
    image: "/images/CommonImages/homepage2.jpg",
  },
  {
    id: "para4",
    title: "Paragraph 4",
    text: "This is the content of paragraph 4. Wrapping things up.I want to create a sideshow..that is, I want a paragraph on the left and an image related to the paragraph on the right. But when the paragraph is on the left, it can be scrolled. When scrolling, the image related to the paragraph should be on the right..For example, there are 4 paragraphs on the left. There is an image on the right..When the paragraph on the left is scrolled, the image related to the first ",
    image: "/images/CommonImages/homepage1.jpg",
  },
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(sections[0].image);
  const refs = useRef<(HTMLDivElement | null)[]>([]); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const index = refs.current.findIndex((ref) => ref === visible.target);
          if (index !== -1) {
            setCurrentImage(sections[index].image);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <main className="p-5 flex h-screen overflow-hidden">
      {/* Left scrollable paragraphs rounded-b-2xl*/}
      <div className="w-1/2 h-screen overflow-y-scroll p-5 space-y-20 scrollbar-red">
        {sections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => { refs.current[index] = el;}}
            className="max-h-[100vh] border-4 border-white border-b-[#3d3d3d]"
          >
            <div className="p-4">
                 <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{section.title}</h2>
                 <p className="text-2xl leading-relaxed text-gray-800 text-center">{section.text}</p>
            </div> 
          </div>
        ))}
      </div>

      {/* Right fixed image */}
      <div className="w-1/2 h-screen sticky top-0 flex items-center justify-center bg-white">
        <Image
          src={currentImage}
          alt="Illustration"
          width={500}
          height={500}
          className="object-contain rounded-xl shadow-md"
        />
      </div>
    </main>
  );
}
