

// 'use client';
// import React, { useEffect } from 'react';

// const CvSubmit: React.FC = () => {
//   useEffect(() => {
//     const slider = document.getElementById('slider') as HTMLDivElement | null;
//     let scrollAmount = 0;
//     const scrollStep = 1; // Pixels to scroll per frame
//     const scrollInterval = 20; // Milliseconds between scroll steps

//     const scroll = () => {
//       if (slider) {
//         scrollAmount += scrollStep;
//         slider.scrollLeft = scrollAmount;

//         // Reset to start when reaching the end of duplicated content
//         if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
//           scrollAmount = 0;
//           slider.scrollLeft = 0;
//         }
//       }
//     };

//     const intervalId = setInterval(scroll, scrollInterval);

//     return () => clearInterval(intervalId); // Cleanup on component unmount
//   }, []);

//   const boxes = [
//     'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack', 'Mobile', 'QA', 'AI',
//     'ML', 'Game Dev', 'Project Mgr', 'Security', 'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack',
//     // Duplicate first 7 items for seamless looping
//     'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack', 'Mobile', 'QA',
//   ];

//   // Group boxes into slides of 8 items each
//   const slides = [];
//   for (let i = 0; i < boxes.length; i += 8) {
//     slides.push(boxes.slice(i, i + 8));
//   }

//   return (
//     <div className="p-5">
//       <div>
//         <h1 className="text-3xl font-bold mb-4">Apply CV</h1>
//         <div
//           id="slider"
//           className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
//           style={{ scrollBehavior: 'smooth' }}
//         >
//           {slides.map((slide, slideIndex) => (
//             <div
//               key={slideIndex}
//               className="grid grid-cols-4 grid-rows-2 gap-6 min-w-[100vw] px-3"
//             >
//               {slide.map((label, index) => (
//                 <div
//                   key={`${slideIndex}-${index}`}
//                   className={`bg-blue-400 rounded-2xl text-center text-2xl py-8 snap-center ${
//                     index >= 4 ? 'row-start-2' : ''
//                   }`}
//                 >
//                   {label}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CvSubmit;

'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const CvSubmit: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slider = document.getElementById('slider') as HTMLDivElement | null;
    let scrollAmount = 0;
    const scrollStep = 1; // Pixels to scroll per frame
    const scrollInterval = 20; // Milliseconds between scroll steps
    const slideWidth = window.innerWidth; // Approximate slide width (viewport width)

    const scroll = () => {
      if (slider) {
        scrollAmount += scrollStep;
        slider.scrollLeft = scrollAmount;

        // Update active slide based on scroll position
        const currentSlide = Math.round(slider.scrollLeft / slideWidth);
        setActiveSlide(currentSlide);

        // Reset to start when reaching the end of duplicated content
        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
          scrollAmount = 0;
          slider.scrollLeft = 0;
          setActiveSlide(0);
        }
      }
    };

    const intervalId = setInterval(scroll, scrollInterval);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const boxes = [
    'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack', 'Mobile', 'QA', 'AI',
    'ML', 'Game Dev', 'Project Mgr', 'Security', 'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack',
    // Duplicate first 7 items for seamless looping
    'Frontend', 'UI / UX', 'Backend', 'DevOps', 'Fullstack', 'Mobile', 'QA',
  ];

  // Group boxes into slides of 8 items each
  const slides = [];
  for (let i = 0; i < boxes.length; i += 8) {
    slides.push(boxes.slice(i, i + 8));
  }

  return (
    <div className="p-5 ">
      <div className='p-5'>
        <div>
          <Image src={"/images/CommonImages/backgraoundImage1.jpg"} alt='' width={1500} height={200}/>
        </div>

        {/* <h1 className="text-3xl font-bold mb-4">Apply CV</h1> */}
        {/* Slides Show */}

        <div className='bg-[#f6f6f6]'>
           <div className='flex flex-row'>
             <div className='basis-2/5 '>
                <div className='p-5 flex justify-center'>
                   <Image src={"/images/CommonImages/Sample CV Template.jpg"} alt='' width={400} height={350}/>
                </div>
             </div>
             <div className='basis-3/5'>
                <div className='text-left p-5 mt-5 text-md'>
                        {/* <h2 className="text-2xl font-bold text-red-600 mb-4">Upload Your CV – Key Information</h2> */}
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
                <div className='flex justify-center mb-4'>
                   <button className='px-10 py-2 bg-black text-white rounded-2xl text-lg'>Download Sample CV</button>
                </div>
             </div>
           </div>
        </div>
        <div
          id="slider"
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="grid grid-cols-4 grid-rows-2 gap-6 min-w-[100vw] px-3"
            >
              {slide.map((label, index) => (
                <div
                  key={`${slideIndex}-${index}`}
                  className={`bg-[#5d5d5d] text-white rounded-2xl text-center text-2xl py-8 snap-center ${
                    index >= 4 ? 'row-start-2' : ''
                  }`}
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
              className={`w-3 h-3 rounded-full ${
                activeSlide === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

      <div className="p-4 mt-5 bg-gray-500 rounded-xl shadow-md max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-15">
          {/* Dropdown */}
          <div className="md:basis-1/2">
            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700">
              <option value="">Positions</option>
              <option value="">Intern</option>
              <option value="">Associate SE</option>
              <option value="">Senior SE</option>
            </select>
          </div>

          {/* File input */}
          <div className="md:basis-1/2">
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
              placeholder="Upload Image"
            />
          </div>
        </div>
      </div>


        {/* <div className='px-36'>
            <div className="grid grid-cols-6 grid-rows-2 gap-6">
                <div className='bg-amber-300 text-center p-5 rounded-3xl' >1</div>
                <div className='bg-amber-300 text-center p-5 rounded-3xl' >2</div>
                <div className='bg-amber-300 text-center p-5 rounded-3xl' >3</div>
                <div className='bg-amber-300 text-center p-5 rounded-3xl' >4</div>
                <div className='bg-amber-300 text-center p-5 rounded-3xl' >5</div>
                <div className='bg-amber-300 text-center p-5 rounded-3xl' >6</div>
            </div>
        </div> */}
      </div>
    </div>
  );
};

export default CvSubmit;