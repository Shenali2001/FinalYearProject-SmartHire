'use client';
import Image from 'next/image';
import SlideShow1 from '@/components/HomePageSlideShow';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaRocket } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

// SlideShow Component (Renamed CvSubmit from previous response)
const SlideShow: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Dropped file:', file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleBrowseClick = () => {
    document.getElementById('cv-upload')?.click();
  };

  useEffect(() => {
    const slider = document.getElementById('slider') as HTMLDivElement | null;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 20;

    const scroll = () => {
      if (slider) {
        const slideWidth = slider.clientWidth;
        scrollAmount += scrollStep;
        slider.scrollLeft = scrollAmount;

        const currentSlide = Math.round(slider.scrollLeft / slideWidth);
        setActiveSlide(currentSlide);

        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
          scrollAmount = 0;
          slider.scrollLeft = 0;
          setActiveSlide(0);
        }
      }
    };

    const intervalId = setInterval(scroll, scrollInterval);
    return () => clearInterval(intervalId);
  }, []);

  const boxes = [
    'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack', 'Mobile', 'QA', 'AI',
    'ML', 'Game Dev', 'Project Mgr', 'Security', 'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack',
    'Mobile', 'QA',
  ];

  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 8;
    if (window.innerWidth < 640) return 4;
    if (window.innerWidth < 1024) return 6;
    return 8;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = [];
  for (let i = 0; i < boxes.length; i += itemsPerSlide) {
    slides.push(boxes.slice(i, i + itemsPerSlide));
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="mb-6">
        <div className="text-center mb-6">
          <p className="text-3xl sm:text-4xl md:text-5xl font-medium">
            Are You Ready for the Interview?
          </p>
        </div>
        <div className="bg-[#f6f6f6] rounded-tl-[100px] sm:rounded-tl-[200px] md:rounded-tl-[300px] rounded-tr-[30px] sm:rounded-tr-[40px] rounded-b-[30px] sm:rounded-b-[40px] p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:basis-2/5 flex justify-center">
              <div className="border-2 p-0.5 bg-black max-w-full">
                <Image
                  src="/images/CommonImages/Sample CV Template.jpg"
                  alt="Sample CV"
                  width={400}
                  height={350}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="lg:basis-3/5">
              <div className="text-left p-4 sm:p-6">
                <div className="bg-black">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-center py-2">
                    CV – Key Information
                  </h2>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm sm:text-base">
                  <li>Uploading your CV is the first step toward using our AI interview platform effectively.</li>
                  <li>Your CV helps our system understand your background, skills, and goals.</li>
                  <li>This enables personalized mock interviews, skill-based questions, and accurate feedback.</li>
                  <li>Make sure your CV includes:
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Full name and contact details</li>
                      <li>A brief professional summary</li>
                      <li>Education background</li>
                      <li>Technical or soft skills</li>
                      <li>Projects or achievements</li>
                      <li>Work experience or internships</li>
                    </ul>
                  </li>
                  <li>Refer to the sample CV provided above for a clear format.</li>
                  <li>Use keywords relevant to your field (e.g., “React”, “Spring Boot” for developers).</li>
                  <li>Keep the content updated with your latest experience and accomplishments.</li>
                  <li>Accepted file formats: PDF, DOCX, JPG, or PNG.</li>
                  <li>Your uploaded CV will remain secure and private.</li>
                  <li>It will only be used to enhance your interview preparation experience.</li>
                  <li>A well-structured CV ensures better results and more relevant AI guidance.</li>
                </ul>
              </div>
              <div className="flex justify-center mb-6">
                <button className="px-6 py-2 sm:px-8 sm:py-3 bg-black text-white rounded-2xl text-base sm:text-lg">
                  Download Sample CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="px-4 sm:px-8 mt-4 mb-4">
          <p className="text-2xl sm:text-3xl font-semibold">Select Your Job Type</p>
        </div>
        <div
          id="slider"
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 min-w-[100vw] px-3 ${
                itemsPerSlide === 4 ? 'grid-rows-2' : itemsPerSlide === 6 ? 'grid-rows-2' : 'grid-rows-2'
              }`}
            >
              {slide.map((label, index) => (
                <div
                  key={`${slideIndex}-${index}`}
                  className="bg-[#5d5d5d] text-white rounded-2xl text-center text-lg sm:text-xl py-6 sm:py-8 snap-center"
                >
                  {label}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                activeSlide === index ? 'bg-[#3d3d3d]' : 'bg-[#888888]'
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="px-4 sm:px-8 mt-4 mb-4">
          <p className="text-2xl sm:text-3xl font-semibold">Select Your Positions</p>
        </div>
        <div className="px-4 sm:px-8 py-6 bg-[#f6f6f6] rounded-xl shadow-md max-w-6xl mx-auto">
          <div className="flex flex-col">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black hover:bg-gray-300 cursor-pointer text-sm sm:text-base"
            >
              <option value="">Positions</option>
              <option value="intern">Intern</option>
              <option value="associate-se">Associate SE</option>
              <option value="senior-se">Senior SE</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 mt-6 mb-6">
        <p className="text-2xl sm:text-3xl font-semibold">Upload Your CV</p>
        <div className="max-w-5xl mx-auto mt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 transition-colors duration-300 ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              id="cv-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <MdOutlineCloudUpload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
            <p className="text-gray-600 text-sm sm:text-base">
              Drag and drop your CV here, or click to browse
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              PDF, DOC, DOCX up to 10MB
            </p>
            <button
              onClick={handleBrowseClick}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-black border rounded hover:bg-[#3d3d3d] text-white text-sm sm:text-base"
            >
              Browse Files
            </button>
            {selectedFile && (
              <p className="text-green-600 text-xs sm:text-sm">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black rounded-tl-[50px] sm:rounded-tl-[100px] rounded-br-[50px] sm:rounded-br-[100px]">
        <div className="text-white text-center p-6 sm:p-10">
          <p className="text-xl sm:text-2xl md:text-3xl">
            Ready to Ace Your Next Interview?
          </p>
          <p className="text-base sm:text-lg md:text-xl mt-2">
            Join thousands of professionals who have improved their interview skills with our SmartHire platform.
          </p>
          <div className="flex justify-center mt-6 sm:mt-10">
            <button className="flex items-center gap-3 sm:gap-5 text-lg sm:text-2xl md:text-3xl bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-2xl hover:bg-[#b0b0b0]">
              <FaRocket /> Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Component
export default function Home() {
  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        {/* Left (Image) */}
        <div className="w-full md:w-1/2">
          <div className="mt-8 sm:mt-10 md:mt-12 px-4 sm:px-8 md:px-12">
            <Image
              src="/images/CommonImages/homepage2.jpg"
              alt="Hero Image"
              width={500}
              height={200}
              className="rounded-3xl object-cover w-full h-auto max-h-64 sm:max-h-80 md:max-h-96"
            />
          </div>
        </div>

        {/* Right (Text + Button + Logo) */}
        <div className="w-full md:w-1/2">
          <div className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-center mt-4 sm:mt-6">
              <div className="text-3xl sm:text-4xl md:text-5xl font-medium text-center sm:text-left">
                Welcome to
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Image
                  src="/images/CommonImages/logoBlack.png"
                  alt="Logo"
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain"
                />
              </div>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl text-center sm:text-left text-gray-800 leading-normal mt-4 sm:mt-6">
              Discover amazing destinations and experiences curated just for you.
            </p>
            <div className="flex flex-col sm:flex-row mt-6 sm:mt-8 md:mt-10 gap-4 sm:gap-6">
              <button className="px-6 py-2 sm:px-8 sm:py-3 bg-black text-white rounded-full text-base sm:text-lg hover:bg-gray-900 transition w-full sm:w-auto">
                Sign In as Candidate
              </button>
              <button className="px-6 py-2 sm:px-8 sm:py-3 bg-black text-white rounded-full text-base sm:text-lg hover:bg-gray-900 transition w-full sm:w-auto">
                Sign Up as Candidate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SlideShow Section */}
      <div className="mt-6 sm:mt-8 md:mt-10">
        <SlideShow1 />
      </div>
    </div>
  );
}