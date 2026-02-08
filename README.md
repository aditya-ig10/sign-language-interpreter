# Sign Language Interpreter

An AI-powered web application that recognizes sign language gestures in real-time using computer vision and machine learning, helping bridge communication gaps between sign language users and non-users.

## ✨ Features

- **Real-time Sign Language Recognition**: Instantly detects and interprets sign language gestures through your camera using Teachable Machine AI models
- **Live Translation**: Converts sign language gestures to text in real-time with confidence indicators
- **Session Management**: 
  - View current session translations
  - Browse conversation history
  - Copy translations to clipboard
  - Download conversations as text files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Built-in theme switching for comfortable viewing
- **Privacy-Focused**: All processing happens in the browser - no video data is sent to servers

## 🚀 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **ML Model**: [Teachable Machine](https://teachablemachine.withgoogle.com/) by Google
- **AI Library**: TensorFlow.js with Teachable Machine Image library
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm, pnpm, or yarn package manager
- A webcam for sign language recognition

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aditya-ig10/sign-language-interpreter.git
   cd sign-language-interpreter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

1. **Enable Camera Access**
   - Click the "Turn On Camera" button
   - Allow camera permissions when prompted by your browser

2. **Start Interpreting**
   - Position yourself in frame so your signs are clearly visible
   - Click the "Start" button to begin sign language interpretation
   - Perform sign language gestures in front of the camera

3. **View Translations**
   - The recognized gesture and confidence level appear at the bottom of the video feed
   - Translated text appears in real-time in the "Current Session" panel
   - Access previous conversations in the "History" tab

4. **Save Your Work**
   - Click "Copy" to copy the current session text to clipboard
   - Click "Download" to save the conversation as a text file
   - Click "Reset" to clear the current session and start fresh

## ⚙️ Configuration

### Teachable Machine Model

The application uses a Teachable Machine model for gesture recognition. You can replace it with your own trained model:

1. Train your model at [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Export your model and get the sharing URL
3. Update the `MODEL_URL` in `components/sign-language-interpreter.tsx`:
   ```typescript
   const MODEL_URL = 'YOUR_MODEL_URL_HERE';
   ```

### Recognition Settings

You can adjust these parameters in `components/sign-language-interpreter.tsx`:

- `CONFIDENCE_THRESHOLD`: Minimum confidence level for gesture recognition (default: 0.75)
- `PREDICTION_DEBOUNCE`: Time in milliseconds to wait between predictions (default: 500ms)

## 📁 Project Structure

```
sign-language-interpreter/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── history/             # Conversation history page
│   ├── settings/            # Settings page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── sign-language-interpreter.tsx  # Main interpreter component
│   ├── loading-spinner.tsx  # Loading component
│   ├── theme-provider.tsx   # Theme context provider
│   └── ui/                  # UI components (shadcn/ui)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── public/                  # Static assets
│   └── gestures/           # Gesture reference images
├── styles/                  # Additional styles
├── package.json            # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🧪 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🌐 Deployment

The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

Alternatively, you can deploy to other platforms that support Next.js applications.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Teachable Machine](https://teachablemachine.withgoogle.com/) by Google for the machine learning model platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) team for the amazing framework
- The sign language community for inspiring this project

## 📧 Contact

For questions or suggestions, please open an issue on GitHub or contact the repository owner.

---

Made with ❤️ to help bridge communication gaps through technology
