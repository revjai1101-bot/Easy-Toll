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
          {/* THE KNOWLEDGE HUB (MASSIVE CONTENT SECTION)              */}
          {/* ======================================================== */}
          <article className="mt-24 border-t border-gray-800 pt-16 max-w-6xl mx-auto text-gray-300">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Documentation Standards & Best Practices</h2>
              <p className="text-xl text-gray-400">The Ultimate Guide for System Engineers and Support Professionals</p>
            </div>

            {/* 1. KEY CONCEPTS & DEFINITION */}
            <div className="mb-20 bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
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

            {/* 2. REAL WORLD STORIES (NEW: HIGH VALUE) */}
            <div className="mb-20">
               <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">Case Studies: The Cost of Poor Documentation</h3>
               <p className="mb-8 text-gray-400">History is filled with expensive disasters caused not by bad code, but by bad communication. These stories highlight why tools like NoteRefiner are critical for mission-critical environments.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Story 1 */}
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
                     <h4 className="text-xl font-bold text-white mb-2">1. The Mars Climate Orbiter ($327M Loss)</h4>
                     <p className="text-sm text-gray-400 mb-4 italic">September 1999</p>
                     <p className="text-sm leading-relaxed mb-4">
                        NASA lost a $327 million spacecraft because of a simple documentation error. One engineering team used <strong>Metric units</strong> (Newtons) while another used <strong>Imperial units</strong> (Pounds-force) in their software specifications. 
                     </p>
                     <p className="text-sm font-bold text-red-400">
                        The Lesson: Standardized formats save lives (and millions of dollars). Ambiguity in units or error codes is unacceptable in engineering.
                     </p>
                  </div>

                  {/* Story 2 */}
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
                     <h4 className="text-xl font-bold text-white mb-2">2. The Knight Capital Glitch ($440M Loss)</h4>
                     <p className="text-sm text-gray-400 mb-4 italic">August 2012</p>
                     <p className="text-sm leading-relaxed mb-4">
                        In just 45 minutes, Knight Capital Group lost $440 million due to a failed deployment. An engineer forgot to copy new code to one of the eight servers because the <strong>deployment manual was outdated</strong> and unstructured.
                     </p>
                     <p className="text-sm font-bold text-red-400">
                        The Lesson: Checklists and clear "Steps to Reproduce" are not optional. They must be generated accurately every time.
                     </p>
                  </div>
               </div>
            </div>

            {/* 3. STATISTICS & FACTS (NEW) */}
            <div className="mb-20 bg-blue-900/20 p-8 rounded-xl border border-blue-900/50">
               <h3 className="text-2xl font-bold text-white mb-8 text-center">Did You Know?</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                     <div className="text-4xl font-black text-blue-400 mb-2">19%</div>
                     <p className="text-sm text-gray-300">of a knowledge worker's week is spent just <strong>searching</strong> for information and reading internal docs (McKinsey).</p>
                  </div>
                  <div>
                     <div className="text-4xl font-black text-blue-400 mb-2">$5k</div>
                     <p className="text-sm text-gray-300">is the estimated annual cost per employee due to productivity loss from "Knowledge Barriers" and poor documentation.</p>
                  </div>
                  <div>
                     <div className="text-4xl font-black text-blue-400 mb-2">40%</div>
                     <p className="text-sm text-gray-300">of IT incidents are caused by <strong>Change Management</strong> errors, often due to poor handover notes between shifts.</p>
                  </div>
               </div>
            </div>

            {/* 4. MOTIVATION: THE "TOIL" PROBLEM (NEW) */}
            <div className="mb-20">
               <h3 className="text-2xl font-bold text-white mb-6">Ending the Burnout of "Toil"</h3>
               <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2">
                     <p className="text-gray-300 leading-relaxed mb-4">
                        In Site Reliability Engineering (SRE), Google defines <strong>"Toil"</strong> as work that is manual, repetitive, automated-able, and devoid of enduring value. 
                     </p>
                     <p className="text-gray-300 leading-relaxed mb-4">
                        Formatting Jira tickets, cleaning up meeting minutes, and rewriting email updates are the definition of Toil. It drains your mental energy (Cognitive Load), leaving you with less brainpower for solving complex server issues.
                     </p>
                     <p className="text-white font-bold border-l-4 border-green-500 pl-4">
                        NoteRefiner is an Anti-Toil Tool. By automating the formatting, you reclaim your focus for high-value engineering.
                     </p>
                  </div>
                  <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg border border-gray-700">
                     <h4 className="text-lg font-bold text-white mb-3">The "Broken Telephone" Effect</h4>
                     <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-center gap-3">
                           <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">Support</span>
                           <span>"User says internet is slow." (Vague)</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">QA Team</span>
                           <span>"Testing internet speed... seems fine?" (Confusion)</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">NoteRefiner</span>
                           <span className="text-white font-bold">"Latency > 500ms detected on API Gateway US-East." (Actionable)</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* 5. RECOMMENDED LEARNING PATHS */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Career Growth Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="https://grow.google/certificates/it-support/" target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition h-full flex flex-col">
                    <div className="text-blue-500 font-bold text-lg mb-2 group-hover:underline">Google IT Support Cert &rarr;</div>
                    <p className="text-sm text-gray-400 flex-1">Master the fundamentals of IT troubleshooting and standard documentation practices.</p>
                  </div>
                </a>
                <a href="https://aws.amazon.com/certification/certified-cloud-practitioner/" target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition h-full flex flex-col">
                    <div className="text-orange-500 font-bold text-lg mb-2 group-hover:underline">AWS Cloud Practitioner &rarr;</div>
                    <p className="text-sm text-gray-400 flex-1">Learn the cloud terminology required for accurate server logging and reporting.</p>
                  </div>
                </a>
                <a href="https://www.comptia.org/certifications/network" target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition h-full flex flex-col">
                    <div className="text-red-500 font-bold text-lg mb-2 group-hover:underline">CompTIA Network+ &rarr;</div>
                    <p className="text-sm text-gray-400 flex-1">Understand the networking protocols (TCP/IP, DNS) cited in technical logs.</p>
                  </div>
                </a>
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
