import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, Image as ImageIcon, Check } from "lucide-react";
import { SAMPLE_FACES } from "../data";

interface CameraCaptureProps {
  gender: "male" | "female";
  selectedConcerns: string[];
  onCapture: (base64Image: string) => void;
  onUseSampleFace: (base64Image: string) => void;
}

export default function CameraCapture({
  gender,
  selectedConcerns,
  onCapture,
  onUseSampleFace,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<"inactive" | "active" | "error">("inactive");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "samples">("camera");

  const filteredSamples = SAMPLE_FACES.filter(face => face.gender === gender);

  useEffect(() => {
    if (activeTab === "camera" && cameraState === "inactive" && !previewImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Camera play interrupted or failed:", error);
          });
        }
      }
      setCameraState("active");
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraState("error");
      setCameraError(
        "Could not access the camera. You can still upload a photo or use a premium test sample face below."
      );
      setActiveTab("samples");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraState("inactive");
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPreviewImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUseSample = (sampleImgUrl: string) => {
    setPreviewImage(sampleImgUrl);
  };

  const resetCapture = () => {
    setPreviewImage(null);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  const handleConfirm = () => {
    if (previewImage) {
      onCapture(previewImage);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6" id="skin-capture-container">
      {/* Luxurious Tab Switcher */}
      <div className="flex bg-[#F4EDE4] p-1 rounded-full border border-[#E3C2B0]/60 w-full max-w-md shadow-sm" id="capture-tabs">
        <button
          id="tab-camera"
          onClick={() => {
            setActiveTab("camera");
            setPreviewImage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
            activeTab === "camera"
              ? "bg-[#3D2D29] text-[#FAF6F0] shadow-md"
              : "text-[#3D2D29]/60 hover:text-[#3D2D29]"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Live Camera
        </button>
        <button
          id="tab-upload"
          onClick={() => {
            setActiveTab("upload");
            stopCamera();
            setPreviewImage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
            activeTab === "upload"
              ? "bg-[#3D2D29] text-[#FAF6F0] shadow-md"
              : "text-[#3D2D29]/60 hover:text-[#3D2D29]"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Image
        </button>
        <button
          id="tab-samples"
          onClick={() => {
            setActiveTab("samples");
            stopCamera();
            setPreviewImage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
            activeTab === "samples"
              ? "bg-[#3D2D29] text-[#FAF6F0] shadow-md"
              : "text-[#3D2D29]/60 hover:text-[#3D2D29]"
          }`}
        >
          Demo Profiles
        </button>
      </div>

      {/* Main Preview Frame styled exactly like Image 3 */}
      <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-[#E3C2B0] shadow-xl flex items-center justify-center">
        
        {/* Custom White Oval Guide Overlay matching Image 3 precisely */}
        {!previewImage && activeTab === "camera" && cameraState === "active" && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
            <div className="flex-1 flex items-center justify-center">
              {/* Face tracking oval guide */}
              <div className="w-[60%] h-[75%] border-2 border-[#FAF6F0] rounded-[100%/100%] shadow-[0_0_0_9999px_rgba(61,45,41,0.45)] relative">
                {/* Horizontal guide lines */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#FAF6F0]/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#FAF6F0]/30"></div>
              </div>
            </div>
            {/* Overlay instruction text */}
            <div className="text-center z-20 pb-4">
              <span className="bg-[#3D2D29]/80 backdrop-blur-sm text-[#FAF6F0] text-[11px] font-bold px-4 py-2 rounded-full border border-[#E3C2B0]/30">
                Align your face inside the oval
              </span>
            </div>
          </div>
        )}

        {/* 1. LIVE CAMERA VIEW */}
        {activeTab === "camera" && (
          <div className="w-full h-full relative">
            {!previewImage && cameraState !== "error" && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}

            {/* Error Message when Camera isn't available */}
            {cameraState === "error" && (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full gap-4 bg-[#FAF6F0]">
                <div className="w-16 h-16 rounded-full bg-[#F4EDE4] border border-[#E3C2B0] flex items-center justify-center text-[#3D2D29]">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h4 className="text-[#3D2D29] font-bold text-base font-display">Webcam Mode Unavailable</h4>
                <p className="text-[#3D2D29]/70 text-xs max-w-sm leading-relaxed">
                  {cameraError}
                </p>
                <button
                  id="error-use-sample-btn"
                  onClick={() => setActiveTab("samples")}
                  className="px-5 py-2.5 bg-[#3D2D29] text-[#FAF6F0] text-xs font-bold rounded-full hover:bg-[#3D2D29]/90 transition"
                >
                  Browse Luxury Samples
                </button>
              </div>
            )}

            {/* Captured Image Still */}
            {previewImage && (
              <div className="w-full h-full relative">
                <img
                  src={previewImage}
                  alt="Captured skin face still"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Snapshot Trigger button (matches Image 3: dark circle) */}
            {!previewImage && cameraState === "active" && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                <button
                  id="snap-photo-btn"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-[#3D2D29] text-[#FAF6F0] border-4 border-[#FAF6F0] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Camera className="w-6 h-6 stroke-[2]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. UPLOAD FILE PANEL */}
        {activeTab === "upload" && (
          <div className="w-full h-full bg-[#FAF6F0]">
            {!previewImage ? (
              <label
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-3xl cursor-pointer transition p-6 text-center ${
                  dragActive
                    ? "border-[#3D2D29] bg-[#F4EDE4]"
                    : "border-[#E3C2B0] hover:border-[#3D2D29]"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-14 h-14 rounded-full bg-[#F4EDE4] border border-[#E3C2B0] flex items-center justify-center text-[#3D2D29] mb-4">
                    <Upload className="w-6 h-6 text-[#CBA38E]" />
                  </div>
                  <p className="mb-2 text-sm text-[#3D2D29] font-semibold font-display">
                    Click to upload face photo
                  </p>
                  <p className="text-xs text-[#3D2D29]/60 max-w-xs leading-relaxed mt-1">
                    Upload an image file. Ensure clear lighting to guarantee high accuracy dermal results.
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src={previewImage}
                  alt="Uploaded skin face still"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* 3. TEST SAMPLE PROFILES (Perfect for quick client-side demos) */}
        {activeTab === "samples" && (
          <div className="w-full h-full p-6 overflow-y-auto flex flex-col justify-center bg-[#FAF6F0]">
            {!previewImage ? (
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#3D2D29] font-display">Select a Demo Profile</h4>
                  <p className="text-xs text-[#3D2D29]/60 max-w-xs mx-auto">
                    Evaluate with a preset bio-profile featuring {gender} skincare conditions.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {filteredSamples.map((sample) => (
                    <button
                      key={sample.id}
                      id={`sample-profile-${sample.id}`}
                      onClick={() => handleUseSample(sample.image)}
                      className="group flex flex-col items-center p-2.5 bg-[#F4EDE4] hover:bg-[#FAF6F0] border border-[#E3C2B0]/60 hover:border-[#3D2D29] rounded-2xl transition"
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 shadow-sm">
                        <img
                          src={sample.image}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="w-full text-center">
                        <span className="text-[#3D2D29] font-bold text-[11px] block truncate font-display">{sample.name}</span>
                        <div className="flex gap-1 justify-center mt-1 flex-wrap">
                          {sample.concerns.map((conc, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-[#FAF6F0] text-[8px] font-mono font-bold text-[#CBA38E] rounded uppercase tracking-wider"
                            >
                              {conc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative -m-6 aspect-square sm:aspect-[4/3]">
                <img
                  src={previewImage}
                  alt="Selected sample profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Capture Confirmation Action Bar */}
      {previewImage && (
        <div className="flex gap-3 w-full max-w-md mt-2" id="capture-confirmation-controls">
          <button
            id="recapture-btn"
            onClick={resetCapture}
            className="flex-1 py-3 px-4 border border-[#E3C2B0] bg-transparent text-[#3D2D29] font-semibold text-xs rounded-xl hover:bg-[#F4EDE4] transition"
          >
            Choose Another Photo
          </button>
          <button
            id="analyze-image-btn"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Personalized Routine
          </button>
        </div>
      )}
    </div>
  );
}
