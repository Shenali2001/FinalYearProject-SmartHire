'use client';
import React, { useEffect, useState } from 'react';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaRocket } from 'react-icons/fa';
import CvTemplateSections from '../components/CvTemplateSections';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utils/firebase";


interface JobType {
  name: string;
  id: number;
}

interface JobPosition {
  id: number;
  name: string;
  type_id: number;
}

interface UploadCv {
   type_id: number;
   position_id: number;
   cv : string;
}

const CvSubmit: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobType, setJobType] = useState<JobType[]>([]);
  const [selectedJobType, setSelectedJobType] = useState<number | null>(null);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

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

  
  const BASE_URL = "http://127.0.0.1:8000";
  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaGVuYWxpMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJjYW5kaWRhdGUiLCJleHAiOjE3NTI4NjI0Njh9.IEw34NwkuEKQ67nvDd_CrWYvUbARJdblvUEJ16JCs98";

  // fetch job-Type
  useEffect(() => {
    const fetchJobType = async () => {
      try {
        const response = await fetch(`${BASE_URL}/jobs/jobs/types`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: JobType[] = await response.json();
        setJobType(data);
        console.log('Job Types:', data);
      } catch (error) {
        console.error('Failed to fetch job positions:', error);
      }
    };
    fetchJobType();
  }, []);


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
  for (let i = 0; i < jobType.length; i += itemsPerSlide) {
    slides.push(jobType.slice(i, i + itemsPerSlide));
  }

  const handleJobTypeClick = (jobTypeId: number) => {
  setSelectedJobType(jobTypeId);
};

// Fetch job-Positions
useEffect(() => {
  const fetchJobPositions = async () => {
    if (selectedJobType === null) {
      setJobPositions([]);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/jobs/jobs/types/${selectedJobType}/positions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: JobPosition[] = await response.json();
      setJobPositions(data);
      console.log('Job Positions:', data);
    } catch (error) {
      console.error('Failed to fetch job positions:', error);
      setJobPositions([]);
    }
  };
  fetchJobPositions();
}, [selectedJobType]);

// upload cv
const handleUpload = async () => {
  if (!selectedFile || !selectedJobType || !selectedPosition) {
    alert("Please select a job type, position, and upload a CV.");
    return;
  }

  try {
    setUploading(true);
    const fileName = `cv/${Date.now()}_${selectedFile.name}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Firebase upload error:", error);
        setUploading(false);
        alert("Failed to upload CV.");
      },
      async () => {
        // ✅ Get the public download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Download URL:", downloadURL);

        // Send this to your API
        const payload = {
          cv_url: downloadURL,
          job_type_id: selectedJobType,
          job_position_id: selectedPosition,
        };

        const response = await fetch(`${BASE_URL}/cv/cv/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`API error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("API response:", responseData);
        alert("CV uploaded successfully!");
        setSelectedFile(null);
        setUploadProgress(0);
      }
    );
  } catch (error) {
    console.error("Error during upload:", error);
    alert("Something went wrong during upload.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div>
        <CvTemplateSections />
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
                  className={`bg-[#5d5d5d] text-white rounded-2xl text-center text-lg sm:text-xl py-6 sm:py-8 snap-center cursor-pointer hover:bg-[#4a4a4a] ${
                    selectedJobType === label.id ? 'bg-black border-2 border-blue-400' : ''
                  }`}
                  onClick={() => handleJobTypeClick(label.id)}
                >
                  {label.name || 'Unknown Job Type'}
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
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
            >
              <option value="">Select a Position</option>
              {jobPositions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 mt-6 mb-6">
        <p className="text-2xl sm:text-3xl font-semibold">Upload Your CV</p>
        <div className="max-w-5xl mx-auto mt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 transition-colors duration-300 ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-400"
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
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full mt-4">
                <div
                  className="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {Math.round(uploadProgress)}%
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Submit CV"}
            </button>
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

export default CvSubmit;
