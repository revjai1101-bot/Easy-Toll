"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [inputNote, setInputNote] = useState("");
  const [outputNote, setOutputNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("tech_support");
  const [savedNotes, setSavedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load saved data from local storage
  useEffect(() => {
    const data = localStorage.getItem("my_tech_notes");
    if (data) setSavedNotes(JSON.parse(data));
  }, []);

  async function handleRefine() {
    if (!inputNote) return;
    setLoading(true);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: inputNote, mode: mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutputNote(data.output);
    } catch (error) {
      alert("Error generating note. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!outputNote) return;
    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      original: inputNote,
      refined: outputNote,
      type: mode
    };
    const updatedNotes = [newNote, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem("my_tech_notes", JSON.stringify(updatedNotes));
    alert("Saved to History!");
  }

  function handleDelete(id) {
    const updatedNotes = savedNotes.filter(note => note.id !== id);
    setSavedNotes(updatedNotes);
    localStorage.setItem("my_tech_notes", JSON.stringify(updatedNotes));
  }

  const filteredNotes = savedNotes.filter(note => 
    note.refined.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.original.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar: History & Logs */}
        <aside className="w-full md:w-1/4 bg-gray-800 border-r border-gray-700 p-4 flex flex-col h-[500px] md:h-auto">
          <h2 className="text-xl font-bold text-blue-400 mb-4">Saved Logs</h2>
          <input 
            type="text" 
            placeholder="Search history..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 mb-4 text-sm text-white focus:border-blue-500 outline-none"
          />
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredNotes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-10">No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition cursor-pointer group relative">
                  <div onClick={() => { setOutputNote(note.refined); setInputNote(note.original); }}>
                    <p className="text-xs text-blue-300 font-bold uppercase mb-1">{note.type} • {note.date}</p>
                    <p className="text-sm text-gray-200 line-clamp-2">{note.refined}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                  >✕</button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Right Main Area: Tool Interface */}
        <section className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">NoteRefiner<span className="text-blue-500">.ai</span></h1>
              <p className="text-gray-400 text-sm">Enterprise Documentation Assistant</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300">Mode:</label>
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value)}
                className="bg-gray-800 border border-gray-600 p-2 rounded text-sm text-white focus:border-blue-500 outline-none"
              >
                <option value="tech_support">IT Ticket Log</option>
                <option value="email">Professional Email</option>
                <option value="meeting_minutes">Meeting Minutes</option>
                <option value="kb_article">Knowledge Base Article</option>
              </select>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Input Area */}
            <div className="flex flex-col h-full">
              <label className="mb-2 text-gray-400 text-sm font-semibold">1. Rough Input</label>
              <textarea
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none outline-none transition"
                placeholder="- user cant login&#10;- tried reset password&#10;- error 503..."
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
              />
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full">
              <label className="mb-2 text-gray-400 text-sm font-semibold">2. Refined Documentation</label>
              <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 overflow-auto whitespace-pre-wrap shadow-inner">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-blue-400 animate-pulse">
                    Processing your text...
                  </div>
                ) : (
                  outputNote || <span className="text-gray-600">Result will appear here...</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRefine}
              disabled={loading || !inputNote}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Refining..." : "✨ Generate Documentation"}
            </button>
            <button
              onClick={handleSave}
              disabled={!outputNote}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Save to Logs
            </button>
          </div>

          {/* ======================================================== */}
          {/* EDUCATIONAL RESOURCE CENTER                              */}
          {/* ======================================================== */}
          <article className="mt-24 border-t border-gray-800 pt-16 max-w-6xl mx-auto text-gray-300">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Documentation Standards</h2>
              <p className="text-xl text-gray-400">Industry Guidelines for Technical Communication</p>
            </div>

            {/* Glossary Term */}
            <div className="mb-16 bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
              <div className="flex items-baseline gap-4 mb-4">
                <h3 className="text-3xl font-bold text-white">note refine</h3>
                <span className="text-gray-500 italic text-xl">verb</span>
              </div>
              <p className="text-lg leading-relaxed text-gray-200 border-l-4 border-blue-500 pl-6 mb-6">
                The technical process of transforming unstructured data (logs, shorthand, brain dumps) into standardized, compliant documentation using Natural Language Processing (NLP). This aligns with ISO 9001 quality management standards for record-keeping.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                 <div className="bg-gray-900 p-5 rounded-lg">
                    <h4 className="text-blue-400 font-bold mb-3">Core Applications</h4>
                    <ul className="list-disc list-inside text-sm space-y-2 text-gray-300">
                        <li><strong>Incident Post-Mortems:</strong> Structuring root cause analysis.</li>
                        <li><strong>Change Management:</strong> Documenting RFCs and system updates.</li>
                        <li><strong>Knowledge Transfer:</strong> Creating wiki entries for team on-boarding.</li>
                    </ul>
                 </div>
                 <div className="bg-gray-900 p-5 rounded-lg">
                    <h4 className="text-red-400 font-bold mb-3">Risk Mitigation</h4>
                    <ul className="list-disc list-inside text-sm space-y-2 text-gray-300">
                        <li><strong>Ambiguity Reduction:</strong> Eliminating vague terms like "system is slow."</li>
                        <li><strong>Standardization:</strong> Ensuring all shifts report issues identically.</li>
                        <li><strong>Searchability:</strong> Creating indexable keywords for future retrieval.</li>
                    </ul>
                 </div>
              </div>
            </div>

            {/* Recommended Certifications (NEW) */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Recommended Learning Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="https://grow.google/certificates/it-support/" target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition h-full flex flex-col">
                    <div className="text-blue-500 font-bold text-lg mb-2 group-hover:underline">Google IT Support Professional Certificate &rarr;</div>
                    <p className="text-sm text-gray-400 flex-1">Master the fundamentals of IT support, including troubleshooting, customer service, and system administration documentation.</p>
                  </div>
                </a>
                <a href="https://aws.amazon.com/certification/certified-cloud-practitioner/" target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition h-full flex flex-col">
                    <div className="text-orange-500 font-bold text-lg mb-2 group-hover:underline">AWS Certified Cloud Practitioner &rarr;</div>
                    <p className="text-sm text-gray-400 flex-1">Learn the cloud concepts that NoteRefiner helps you document, including EC2, S3, and standard architectural diagrams.</p>
                  </div>
                </a>
                <a href="https://www.comptia.org/certifications/network" target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition h-full flex flex-col">
                    <div className="text-red-500 font-bold text-lg mb-2 group-hover:underline">CompTIA Network+ &rarr;</div>
                    <p className="text-sm text-gray-400 flex-1">Understand the networking protocols (TCP/IP, DNS) often cited in the logs you refine with our tool.</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Latest Insights / Blog Section (NEW) */}
            <div className="mb-20">
               <h3 className="text-2xl font-bold text-white mb-8">Latest Insights</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Article 1 */}
                  <article className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                    <div className="p-8">
                      <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide">Best Practices</div>
                      <h4 className="text-xl font-bold text-white mb-3">The "5 C's" of Technical Writing</h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        In System Support, "clarity" is a requirement, not a luxury. The 5 C's framework—Clarity, Conciseness, Completeness, Correctness, and Consistency—ensures your tickets are actionable. A vague report like "Login failed" wastes hours, whereas "Login returns 404 on Chrome" is solved in minutes.
                      </p>
                      <span className="text-sm text-gray-500">Read time: 4 mins</span>
                    </div>
                  </article>

                  {/* Article 2 */}
                  <article className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                    <div className="p-8">
                      <div className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wide">Career Growth</div>
                      <h4 className="text-xl font-bold text-white mb-3">Why Senior Engineers Write More</h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        Influence happens through writing. Junior engineers focus on code; Senior engineers focus on Design Docs, RFCs, and Incident Reports. Mastering the art of asynchronous communication is the fastest path to promotion in distributed engineering teams.
                      </p>
                      <span className="text-sm text-gray-500">Read time: 5 mins</span>
                    </div>
                  </article>

               </div>
            </div>

            {/* SRE & Incident Management Section */}
            <div className="mb-16">
               <h3 className="text-2xl font-bold text-white mb-6">SRE & Incident Management</h3>
               <p className="mb-6 text-gray-400 leading-relaxed">
                 In Site Reliability Engineering (SRE), documentation reduces <strong>MTTR (Mean Time To Recovery)</strong>. NoteRefiner streamlines the communication flow during critical outages.
               </p>
               
               <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 border border-gray-700 p-6 rounded-lg bg-gray-900/50">
                     <div className="w-full md:w-1/4">
                        <span className="text-4xl font-black text-blue-500 opacity-50">01</span>
                        <h4 className="text-lg font-bold text-white mt-2">Detection & Triage</h4>
                     </div>
                     <div className="w-full md:w-3/4">
                        <p className="text-sm text-gray-300">
                           Engineers often scribble rough notes during alerts. NoteRefiner converts these into a structured <strong>Incident Timeline</strong> for post-mortem analysis.
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 border border-gray-700 p-6 rounded-lg bg-gray-900/50">
                     <div className="w-full md:w-1/4">
                        <span className="text-4xl font-black text-purple-500 opacity-50">02</span>
                        <h4 className="text-lg font-bold text-white mt-2">Root Cause Analysis</h4>
                     </div>
                     <div className="w-full md:w-3/4">
                        <p className="text-sm text-gray-300">
                           Precise language is vital for "5 Whys" analysis. Our KB Article mode documents the exact chain of events to prevent future recurrence.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-950 text-center text-gray-500 text-sm py-10 border-t border-gray-800">
        <div className="flex justify-center gap-8 mb-6">
          <a href="/privacy" className="hover:text-white transition underline decoration-gray-700 underline-offset-4">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition underline decoration-gray-700 underline-offset-4">Terms of Service</a>
          <a href="/contact" className="hover:text-white transition underline decoration-gray-700 underline-offset-4">Contact Support</a>
        </div>
        <p>&copy; {new Date().getFullYear()} NoteRefiner. All rights reserved.</p>
        <p className="text-xs mt-2 text-gray-600">Optimized for System Support & QA Engineering workflows.</p>
      </footer>
    </div>
  );
}
