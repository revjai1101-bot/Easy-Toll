export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
        <p className="mb-4">We would love to hear from you! Whether you have a question about features, pricing, or need support, our team is ready to answer all your questions.</p>
        
        <div className="bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold text-white mb-2">Email Us</h2>
          <p className="mb-4">For support inquiries, please email us at:</p>
          <p className="text-blue-400 font-bold text-lg">revjai1101@gmail.com</p>
        </div>

        <a href="/" className="text-blue-400 hover:underline mt-8 block">← Back to Tool</a>
      </div>
    </div>
  )
}