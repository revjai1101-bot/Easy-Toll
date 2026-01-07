export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: January 2026</p>
        <p className="mb-4">At NoteRefiner, we respect your privacy. This policy explains how we handle your data.</p>
        
        <h2 className="text-xl font-bold text-white mt-6 mb-2">1. Data Processing</h2>
        <p className="mb-4">We use Google Gemini API to process your text. Your notes are sent to the AI for formatting and returned immediately. We do not store your notes on our servers.</p>

        <h2 className="text-xl font-bold text-white mt-6 mb-2">2. Local Storage</h2>
        <p className="mb-4">Your "Saved Logs" are stored locally on your device using your browser's LocalStorage. If you clear your browser cache, this data will be lost.</p>

        <h2 className="text-xl font-bold text-white mt-6 mb-2">3. Cookies & Ads</h2>
        <p className="mb-4">We may use third-party vendors, including Google, to serve ads based on your prior visits to our website.</p>
        
        <a href="/" className="text-blue-400 hover:underline mt-8 block">← Back to Home</a>
      </div>
    </div>
  )
}