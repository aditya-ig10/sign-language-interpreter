"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Download, Copy, Check, RefreshCw, Camera, CameraOff, AlertCircle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import * as tmImage from '@teachablemachine/image';

interface Prediction {
  gesture: string
  confidence: number
}

interface Conversation {
  timestamp: number
  text: string
}

export default function SignLanguageInterpreter() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [translatedText, setTranslatedText] = useState("")
  const [conversation, setConversation] = useState<Conversation[]>([])
  const [copied, setCopied] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoadingCamera, setIsLoadingCamera] = useState(false)
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null)
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null)
  const isMobile = useMobile()
  const [isComponentMounted, setIsComponentMounted] = useState(false)
  const animationFrameId = useRef<number | null>(null)
  
  // Replace with your Teachable Machine model URL
  const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/mg6bOsSD4/';
  
  // Confidence threshold for predictions
  const CONFIDENCE_THRESHOLD = 0.75;
  // Debounce time to avoid rapid text changes (in ms)
  const PREDICTION_DEBOUNCE = 500;
  // Store the last prediction time
  const lastPredictionTime = useRef<number>(0);
  // Store last gesture to avoid duplicates
  const lastGesture = useRef<string>("");

  // Set component mounted state
  useEffect(() => {
    setIsComponentMounted(true)
    return () => {
      setIsComponentMounted(false)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [])

  // Load Teachable Machine model
  const loadModel = useCallback(async () => {
    if (!isComponentMounted) return;
    
    try {
      setIsLoadingModel(true);
      
      // Load the model and metadata
      const modelURL = MODEL_URL + 'model.json';
      const metadataURL = MODEL_URL + 'metadata.json';
      
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      modelRef.current = loadedModel;
      
      console.log("Model loaded successfully");
      setIsLoadingModel(false);
      return loadedModel;
    } catch (error) {
      console.error("Error loading model:", error);
      setCameraError("Failed to load sign language model. Please refresh the page.");
      setIsLoadingModel(false);
      return null;
    }
  }, [MODEL_URL, isComponentMounted]);

  // Initialize camera
  const initCamera = useCallback(async () => {
    if (!isComponentMounted) return
    
    setIsLoadingCamera(true)
    setCameraError(null)

    try {
      // Load model if not already loaded
      let currentModel = modelRef.current;
      if (!currentModel) {
        const loaded = await loadModel();
        currentModel = loaded ?? null;
        if (!currentModel) {
          setIsLoadingCamera(false);
          return;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100))
      if (!isComponentMounted || !videoRef.current) {
        console.warn("Component not mounted or video element not available")
        setIsLoadingCamera(false)
        setCameraError("Could not access video element. Please try again.")
        return
      }

      const constraints = {
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (!videoRef.current) {
        console.warn("Video element no longer available after getUserMedia")
        stream.getTracks().forEach(track => track.stop())
        setIsLoadingCamera(false)
        setCameraError("Video element became unavailable. Please try again.")
        return
      }
      
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        if (!videoRef.current) return
        
        videoRef.current.play()
          .then(() => {
            setCameraActive(true)
            setIsLoadingCamera(false)
          })
          .catch((err) => {
            console.error("Video play error:", err)
            setCameraError("Failed to start video playback. Please try again.")
            setIsLoadingCamera(false)
          })
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      let errorMessage = "Failed to access camera. Please ensure a camera is available."
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          errorMessage = "Camera access denied. Please allow camera permissions."
        } else if (error.name === "NotFoundError") {
          errorMessage = "No camera found on this device."
        }
      }
      setCameraError(errorMessage)
      setIsLoadingCamera(false)
    }
  }, [isComponentMounted, loadModel])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setIsRecording(false)
    setCameraError(null)
    
    // Clear animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, [])

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (cameraActive) {
      stopCamera()
    } else {
      initCamera()
    }
  }, [cameraActive, initCamera, stopCamera])

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (!cameraActive) return
    setIsRecording((prev) => {
      if (!prev) {
        // Starting a new recording session
        setTranslatedText("")
        lastGesture.current = "";
        // Start prediction loop when recording begins
        if (modelRef.current && videoRef.current) {
          predictLoop();
        }
      } else {
        // Stopping recording
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      }
      return !prev
    })
  }, [cameraActive])

  // Prediction loop
  const predictLoop = useCallback(async () => {
    if (!isRecording || !cameraActive || !modelRef.current || !videoRef.current) return;
    
    try {
      // Make prediction with the model
      const prediction = await modelRef.current.predict(videoRef.current);
      
      // Find the prediction with highest probability
      let highestProbability = 0;
      let bestPrediction: Prediction | null = null;
      
      for (let i = 0; i < prediction.length; i++) {
        const { className, probability } = prediction[i];
        if (probability > highestProbability && probability > CONFIDENCE_THRESHOLD) {
          highestProbability = probability;
          bestPrediction = {
            gesture: className,
            confidence: probability
          };
        }
      }
      
      if (bestPrediction) {
        setCurrentPrediction(bestPrediction);
        
        // Update translated text with debouncing to avoid rapid changes
        const now = Date.now();
        if (
          now - lastPredictionTime.current > PREDICTION_DEBOUNCE && 
          bestPrediction.gesture !== lastGesture.current
        ) {
          lastPredictionTime.current = now;
          lastGesture.current = bestPrediction.gesture;
          
          setTranslatedText((prev) => 
            prev ? `${prev} ${bestPrediction!.gesture}` : bestPrediction!.gesture
          );
        }
      }
    } catch (error) {
      console.error("Prediction error:", error);
    }
    
    // Continue the prediction loop
    if (isRecording && cameraActive) {
      animationFrameId.current = requestAnimationFrame(predictLoop);
    }
  }, [isRecording, cameraActive]);

  // Start prediction loop when recording begins
  useEffect(() => {
    if (isRecording && cameraActive && modelRef.current && videoRef.current) {
      predictLoop();
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isRecording, cameraActive, predictLoop]);

  // Save conversation when recording stops
  useEffect(() => {
    if (!isRecording && translatedText && cameraActive) {
      setConversation((prev) => [
        ...prev,
        { timestamp: Date.now(), text: translatedText },
      ])
    }
  }, [isRecording, translatedText, cameraActive])

  // Copy conversation to clipboard
  const copyToClipboard = useCallback(() => {
    if (!translatedText) return
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [translatedText])

  // Download conversation as text file
  const downloadConversation = useCallback(() => {
    if (!translatedText) return
    const blob = new Blob([translatedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sign-language-conversation-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [translatedText])

  // Reset current session
  const resetSession = useCallback(() => {
    setTranslatedText("")
    setCurrentPrediction(null)
    setIsRecording(false)
    lastGesture.current = "";
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, [])

  // Format timestamp
  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-black rounded-lg aspect-video">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={cn(
                "object-cover w-full h-full",
                !cameraActive && "hidden"
              )} 
            />
            
            {(isLoadingCamera || isLoadingModel) ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-slate-400">
                  {isLoadingModel ? "Loading sign language model..." : "Starting camera..."}
                </p>
              </div>
            ) : !cameraActive && (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Camera className="w-16 h-16 mb-4 text-slate-600" />
                <p className="text-slate-400">Camera is off</p>
              </div>
            )}
            
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                <div className="text-center text-red-400 max-w-md p-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>{cameraError}</p>
                </div>
              </div>
            )}
            
            {currentPrediction && isRecording && (
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center bg-emerald-600 bg-opacity-90">
                <p className="font-medium text-white">
                  {currentPrediction.gesture} ({Math.round(currentPrediction.confidence * 100)}%)
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={toggleCamera}
              variant="outline"
              disabled={isLoadingCamera || isLoadingModel}
              className={cn("flex-1", cameraActive ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" : "")}
            >
              {cameraActive ? (
                <>
                  <CameraOff className="w-4 h-4 mr-2" />
                  Turn Off Camera
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Turn On Camera
                </>
              )}
            </Button>

            <Button
              onClick={toggleRecording}
              disabled={!cameraActive || isLoadingCamera || isLoadingModel}
              variant={isRecording ? "destructive" : "default"}
              className="flex-1"
            >
              {isRecording ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 overflow-hidden">
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="current" className="flex-1">
                  Current Session
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                <div className="h-[200px] overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  {translatedText ? (
                    <p className="text-lg">{translatedText}</p>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center mt-12">
                      {cameraError
                        ? "Resolve camera issues to start"
                        : isLoadingModel
                          ? "Loading sign language model..."
                          : cameraActive
                            ? isRecording
                              ? "Waiting for sign language gestures..."
                              : "Press Start to begin interpreting"
                            : "Turn on camera to start"}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={copyToClipboard} variant="outline" disabled={!translatedText} className="flex-1">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={downloadConversation}
                    variant="outline"
                    disabled={!translatedText}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>

                  <Button onClick={resetSession} variant="outline" disabled={!translatedText} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="h-[260px] overflow-y-auto">
                  {conversation.length > 0 ? (
                    <div className="space-y-3">
                      {conversation.map((item, index) => (
                        <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-500">{formatTime(item.timestamp)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                              onClick={() => navigator.clipboard.writeText(item.text)}
                            >
                              <Copy className="w-3 h-3" />
                              <span className="sr-only">Copy</span>
                            </Button>
                          </div>
                          <p>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center mt-12">No conversation history yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
        <h3 className="mb-2 font-medium text-emerald-800 dark:text-emerald-300">How to use:</h3>
        <ol className="pl-5 space-y-1 text-sm list-decimal text-emerald-700 dark:text-emerald-400">
          <li>Turn on your camera and allow access when prompted</li>
          <li>Position yourself in frame so your signs are clearly visible</li>
          <li>Press Start to begin sign language interpretation</li>
          <li>Perform sign language gestures and see them translated to text</li>
          <li>Download or copy your conversation when finished</li>
        </ol>
      </div>
    </div>
  )
}