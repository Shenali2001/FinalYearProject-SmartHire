'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const sections = [
  {
    id: 'para1',
    title: 'Paragraph 1',
    text: 'This is the content of paragraph 1. It explains something important about our platform, helping you understand its core features.',
    image: '/images/CommonImages/homepage2.jpg',
  },
  {
    id: 'para2',
    title: 'Paragraph 2',
    text: "This is the content of paragraph 2. Here's more information about how our platform enhances your experience.",
    image: '/images/CommonImages/homepage1.jpg',
  },
  {
    id: 'para3',
    title: 'Paragraph 3',
    text: 'This is the content of paragraph 3. Another interesting fact about our services and offerings.',
    image: '/images/CommonImages/homepage2.jpg',
  },
  {
    id: 'para4',
    title: 'Paragraph 4',
    text: 'This is the content of paragraph 4. Wrapping things up with key insights and benefits.',
    image: '/images/CommonImages/homepage1.jpg',
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
        rootMargin: '0px',
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
    <main className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row h-screen overflow-hidden">
      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #3d3d3d;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        @media (max-width: 767px) {
          .scrollbar-custom::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-custom {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>

      {/* Left scrollable paragraphs */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen overflow-y-scroll scrollbar-custom p-4 sm:p-6 space-y-8 md:space-y-12">
        {sections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className="max-h-[50vh] md:max-h-[80vh] border-4 border-white border-b-[#3d3d3d] snap-start"
            aria-labelledby={`title-${section.id}`}
          >
            <div className="p-4 sm:p-6">
              <h2
                id={`title-${section.id}`}
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center"
              >
                {section.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800 text-center">
                {section.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right fixed image */}
      <div
        className="w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center bg-white"
        aria-live="polite"
      >
        <Image
          src={currentImage}
          alt={`Illustration for ${sections.find((s) => s.image === currentImage)?.title || 'section'}`}
          width={500}
          height={500}
          className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-[80vh] object-contain rounded-xl shadow-md"
        />
      </div>
    </main>
  );
}