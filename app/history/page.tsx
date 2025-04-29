import Link from "next/link"
import { ArrowLeft, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-8 space-x-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Conversation History</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Sign Language Conversations</CardTitle>
              <CardDescription>View and manage your past sign language interpretation sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4 space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>

              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">Conversation {index + 1}</h3>
                        <p className="text-sm text-slate-500">
                          {new Date(Date.now() - index * 86400000).toLocaleDateString()} at{" "}
                          {new Date(Date.now() - index * 86400000).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {
                        [
                          "Hello How are you today I am fine Thank you",
                          "Please Help me find the nearest hospital Thank you",
                          "My name is John What is your name Nice to meet you",
                          "Yes I would like some water please Thank you",
                          "No I do not need help right now Thank you",
                        ][index]
                      }
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
