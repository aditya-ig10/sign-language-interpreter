import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Camera, History, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import SignLanguageInterpreter from "@/components/sign-language-interpreter"
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container px-4 py-8 mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold">SignSense</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/history">
              <Button variant="ghost" size="icon">
                <History className="w-5 h-5" />
                <span className="sr-only">History</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </header>

        <section className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">Sign Language Interpreter</h2>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
            Our AI-powered tool recognizes sign language gestures in real-time, helping bridge communication gaps.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-emerald-100 rounded-full dark:bg-emerald-900">
                <Camera className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Real-time Recognition</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Instantly detects and interprets sign language gestures through your camera.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-emerald-100 rounded-full dark:bg-emerald-900">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16V8M12 8L8 12M12 8L16 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">Download Conversations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Save and export your translated conversations for future reference.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-emerald-100 rounded-full dark:bg-emerald-900">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12V3M12 3L9 6M12 3L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">Comprehensive Library</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Recognizes a wide range of sign language gestures from different sign languages.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl p-6 mx-auto mb-12 bg-white rounded-lg shadow-md dark:bg-slate-800">
          <h2 className="mb-6 text-2xl font-bold text-center">Start Interpreting</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <SignLanguageInterpreter />
          </Suspense>
        </section>

        <section className="max-w-4xl mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to get started?</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Begin your sign language interpretation journey now.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Start Interpreting <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </section>
      </div>
    </main>
  )
}
