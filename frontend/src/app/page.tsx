import Image from "next/image";
import SlideShow from "@/components/HomePageSlideShow"

export default function Home() {
  return (
    <div className="bg-white min-h-screen p-4">

      <div className="flex flex-col md:flex-row items-center md:items-start gap-1">
        
        {/* Left (Image) */}
        <div className="w-full md:w-1/2">
          <div className="p-2 md:p-5 ">
            <Image
              src="/images/CommonImages/homepage2.jpg"
              alt="Logo"
              width={700}
              height={400}
              className="rounded-3xl object-cover w-full h-auto max-h-96"
            />
          </div>
        </div>

        {/* Right (Text + Button) */}
        <div className="w-full md:w-1/2">
          <div className="p-2 md:p-5">
            <p className="text-lg md:text-2xl text-center text-gray-800 leading-normal">
              Revolutionize your hiring process with <b>SmartHire</b>, an intelligent interview platform built for fairness, transparency, and innovation.
              In today’s fast-paced recruitment landscape, traditional interviews are no longer enough.
              <b> SmartHire</b> leverages the power of artificial intelligence to conduct adaptive virtual interviews that evaluate candidates holistically—analyzing resumes, responses, and even non-verbal cues with unmatched precision.
            </p>
            <div className="text-center mt-6">
              <button className="px-8 py-3 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition">
                Explore Now
              </button>
            </div>
          </div>
        </div>

      </div>

      {/**** 2nd screen ******* */}
{/* 
       <div className="flex flex-row">
         <div className="basis-1/2">
              <div className="p-5 bg-[#e7e7e7] flex items-center justify-center">
                 <div>
                    <Image src="/images/CommonImages/logoBlack.png" alt="black logo" width={350} height={350} className="items-center"/>
                 </div>
                <div>
                   <button className="px-8 py-3 bg-black text-white rounded-full text-lg hover:bg-gray-900 transition">
                     Get Start
                   </button>
                </div>
              </div>
              
         </div>
          <div className="basis-1/2">
            <div>
               <video src="/images/CommonImages/Animation.mp4"  autoPlay muted 
                          className="w-full h-50 object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"></video>
            </div>
          </div>

       </div> */}
        <div className="p-5 bg-[#3d3d3d] flex items-center justify-center gap-x-18 rounded-tl-[300px] rounded-br-[500px]">
                 <div>
                    <Image src="/images/CommonImages/logoWhite.png" alt="black logo" width={250} height={250} className="items-center"/>
                 </div>
                <div>
                   <button className="px-12 py-3 bg-[#d1d1d1] text-black rounded-full text-2xl hover:bg-[#888888] transition">
                     Get Start
                   </button>
                </div>
        </div>

        {/* ------------3rd screen ------------------ */}
        <div className="mt-3">
           < SlideShow />
        </div>
        
    </div>

  

  );
}
