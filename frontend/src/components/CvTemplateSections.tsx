import React from 'react';
import Image from 'next/image';

const CvTemplateSections = () => {
  return (
    <div>
          {/* CV Template Section */}
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
    </div>
  )
}

export default CvTemplateSections