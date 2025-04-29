import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
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
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure your sign language interpreter preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Camera Settings</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="camera-source">Camera Source</Label>
                    <Select defaultValue="user">
                      <SelectTrigger id="camera-source">
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Front Camera</SelectItem>
                        <SelectItem value="environment">Back Camera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Camera Resolution</Label>
                    <Select defaultValue="720p">
                      <SelectTrigger id="resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p (Recommended)</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recognition Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                      <span className="text-sm text-slate-500">70%</span>
                    </div>
                    <Slider id="confidence-threshold" defaultValue={[70]} max={100} step={5} />
                    <p className="text-xs text-slate-500">Higher values mean more accurate but fewer recognitions</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sign-language">Sign Language</Label>
                      <Select defaultValue="asl">
                        <SelectTrigger id="sign-language">
                          <SelectValue placeholder="Select sign language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                          <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                          <SelectItem value="isl">Indian Sign Language (ISL)</SelectItem>
                          <SelectItem value="auslan">Auslan (Australian Sign Language)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recognition-speed">Recognition Speed</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger id="recognition-speed">
                          <SelectValue placeholder="Select speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fast">Fast (Less accurate)</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="accurate">Accurate (Slower)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interface Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save Conversations</Label>
                      <p className="text-sm text-slate-500">Automatically save all interpreted conversations</p>
                    </div>
                    <Switch id="auto-save" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-confidence">Show Confidence Score</Label>
                      <p className="text-sm text-slate-500">Display confidence percentage for each recognition</p>
                    </div>
                    <Switch id="show-confidence" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-slate-500">Use dark theme for the application</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
