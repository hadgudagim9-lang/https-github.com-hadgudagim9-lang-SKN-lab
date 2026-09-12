import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, Check } from "lucide-react";

interface CameraCaptureProps {
  gender?: "male" | "female";
  selectedConcerns?: string[];
  onCapture: (base64Image: string) => void;
  onUseSampleFace?: (base64Image: string) => void;
}

export default function CameraCapture({
  onCapture,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<"inactive" | "active" | "error">("inactive");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");

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
        "Could not access your camera. Please allow camera permissions or upload an image directly from your device."
      );
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
    <div className="w-full flex flex-col items-center gap-5" id="skin-capture-container">
      {/* 2-Option Tab Switcher: Take Selfie vs Upload Image */}
      <div className="flex bg-[#F4EDE4] p-1 rounded-full border border-[#E3C2B0]/60 w-full max-w-md shadow-xs" id="capture-tabs">
        <button
          id="tab-camera"
          type="button"
          onClick={() => {
            setActiveTab("camera");
            setPreviewImage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-serif font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "camera"
              ? "bg-[#2C1A0E] text-white shadow-sm"
              : "text-[#2C1A0E]/70 hover:text-[#2C1A0E]"
          }`}
        >
          <Camera className="w-4 h-4" />
          Take a Selfie
        </button>
        <button
          id="tab-upload"
          type="button"
          onClick={() => {
            setActiveTab("upload");
            stopCamera();
            setPreviewImage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-serif font-bold rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "upload"
              ? "bg-[#2C1A0E] text-white shadow-sm"
              : "text-[#2C1A0E]/70 hover:text-[#2C1A0E]"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Main Preview Frame */}
      <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#2C1A0E]/90 border border-[#E3C2B0] shadow-xl flex items-center justify-center">
        
        {/* Custom Oval Guide Overlay during Live Camera */}
        {!previewImage && activeTab === "camera" && cameraState === "active" && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
            <div className="flex-1 flex items-center justify-center">
              {/* Face tracking oval guide */}
              <div className="w-[62%] h-[78%] border-2 border-white/90 rounded-[100%/100%] shadow-[0_0_0_9999px_rgba(44,26,14,0.45)] relative">
                {/* Horizontal & vertical subtle crosshairs */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30"></div>
              </div>
            </div>
            {/* Overlay instruction text */}
            <div className="text-center z-20 pb-2">
              <span className="bg-[#2C1A0E]/85 backdrop-blur-sm text-[#FAF7F4] text-[11px] font-semibold px-4 py-1.5 rounded-full border border-[#E3C2B0]/30 shadow-sm">
                Center your face in the oval
              </span>
            </div>
          </div>
        )}

        {/* 1. LIVE CAMERA VIEW (Take a Selfie) */}
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

            {/* Error Message when Camera isn't accessible */}
            {cameraState === "error" && !previewImage && (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full gap-4 bg-[#FAF7F4]">
                <div className="w-14 h-14 rounded-full bg-[#F4EDE4] border border-[#E3C2B0] flex items-center justify-center text-[#2C1A0E]">
                  <AlertCircle className="w-7 h-7 text-[#E879A0]" />
                </div>
                <h4 className="text-[#2C1A0E] font-serif font-bold text-base">Camera Not Available</h4>
                <p className="text-[#2C1A0E]/70 text-xs max-w-xs leading-relaxed">
                  {cameraError}
                </p>
                <button
                  id="error-switch-upload-btn"
                  type="button"
                  onClick={() => {
                    setActiveTab("upload");
                  }}
                  className="px-5 py-2.5 bg-[#2C1A0E] text-white text-xs font-serif font-bold rounded-xl hover:bg-[#3D2D29] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Image Instead
                </button>
              </div>
            )}

            {/* Captured Still Preview */}
            {previewImage && (
              <div className="w-full h-full relative">
                <img
                  src={previewImage}
                  alt="Captured selfie still"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Snapshot Trigger Button */}
            {!previewImage && cameraState === "active" && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20">
                <button
                  id="snap-photo-btn"
                  type="button"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-[#FAF7F4] text-[#2C1A0E] border-4 border-[#2C1A0E] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
                  title="Take Selfie Photo"
                >
                  <Camera className="w-7 h-7 stroke-[2.2] text-[#2C1A0E]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. UPLOAD IMAGE PANEL */}
        {activeTab === "upload" && (
          <div className="w-full h-full bg-[#FAF7F4]">
            {!previewImage ? (
              <label
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-3xl cursor-pointer transition p-6 text-center ${
                  dragActive
                    ? "border-[#2C1A0E] bg-[#F4EDE4]"
                    : "border-[#E3C2B0] hover:border-[#2C1A0E]"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4EDE4] border border-[#E3C2B0] flex items-center justify-center text-[#2C1A0E] mb-3 shadow-2xs">
                    <Upload className="w-6 h-6 text-[#2C1A0E]" />
                  </div>
                  <p className="mb-1 text-sm text-[#2C1A0E] font-serif font-bold">
                    Upload Your Face Photo
                  </p>
                  <p className="text-xs text-[#2C1A0E]/65 max-w-xs leading-relaxed">
                    Click to browse your photos or drag and drop an image here.
                  </p>
                  <span className="mt-3 text-[10px] font-mono uppercase tracking-wider font-bold text-[#E879A0] bg-white border border-[#E3C2B0]/80 px-3 py-1 rounded-full">
                    PNG, JPG or WEBP
                  </span>
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
                  alt="Uploaded face still"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation & Continue Controls */}
      {previewImage && (
        <div className="flex gap-3 w-full max-w-md mt-1 animate-in fade-in" id="capture-confirmation-controls">
          <button
            id="recapture-btn"
            type="button"
            onClick={resetCapture}
            className="flex-1 py-3 px-4 border border-[#E3C2B0] bg-white text-[#2C1A0E] font-serif font-bold text-xs rounded-2xl hover:bg-[#F4EDE4] transition cursor-pointer"
          >
            Retake / Change
          </button>
          <button
            id="analyze-image-btn"
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-[#2C1A0E] hover:bg-[#3D2D29] text-white font-serif font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Analyze My Skin
          </button>
        </div>
      )}
    </div>
  );
}
