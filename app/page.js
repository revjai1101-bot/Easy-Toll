"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [inputNote, setInputNote] = useState("");
  const [outputNote, setOutputNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("tech_support");
  const [savedNotes, setSavedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        
        {/* SIDEBAR */}
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

        {/* MAIN TOOL AREA */}
        <section className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">NoteRefiner<span className="text-blue-500">.ai</span></h1>
              <p className="text-gray-400 text-sm">Professional AI Formatting Tool</p>
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
            {/* INPUT */}
            <div className="flex flex-col h-full">
              <label className="mb-2 text-gray-400 text-sm font-semibold">1. Paste Rough Notes</label>
              <textarea
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none outline-none transition"
                placeholder="- user cant login&#10;- tried reset password&#10;- error 503..."
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
              />
            </div>

            {/* OUTPUT */}
            <div className="flex flex-col h-full">
              <label className="mb-2 text-gray-400 text-sm font-semibold">2. AI Refined Output</label>
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
              {loading ? "Refining..." : "✨ Generate Professional Text"}
            </button>
            <button
              onClick={handleSave}
              disabled={!outputNote}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Save to History
            </button>
          </div>

          {/* --- ADSENSE OPTIMIZED CONTENT GUIDE (300+ Words) --- */}
          <article className="mt-20 border-t border-gray-800 pt-10 max-w-4xl mx-auto text-gray-300 leading-relaxed">
            <h2 className="text-3xl font-bold text-white mb-6">How to Use NoteRefiner: A Complete Guide</h2>
            
            <p className="mb-6">
              Welcome to <strong>NoteRefiner</strong>, the ultimate productivity tool designed for IT professionals, project managers, and corporate communicators. 
              Writing professional documentation often takes more time than the actual work itself. Our tool solves this by using advanced AI to instantly transform your messy, 
              shorthand "brain dumps" into polished, structured, and grammatically correct documents.
            </p>

            <h3 className="text-xl font-bold text-white mb-3">Step-by-Step Instructions</h3>
            <ol className="list-decimal pl-6 mb-8 space-y-2">
              <li><strong>Select Your Mode:</strong> Use the dropdown menu at the top right to choose the format you need (e.g., IT Ticket, Email, Meeting Minutes).</li>
              <li><strong>Input Rough Notes:</strong> In the left box, type or paste your raw notes. You don't need to worry about grammar, spelling, or formatting. Just get the facts down.</li>
              <li><strong>Generate:</strong> Click the blue "Generate" button. In seconds, our AI will restructure your information.</li>
              <li><strong>Review and Save:</strong> Read the polished output on the right. If you like it, click "Save to History" to store it in your browser for later reference.</li>
            </ol>

            <h3 className="text-xl font-bold text-white mb-3">Understanding the Modes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-blue-400 font-bold mb-2">IT Ticket Log</h4>
                <p className="text-sm">Perfect for Helpdesk and SysAdmins. It organizes notes into Issue Summary, Observations, Troubleshooting Steps, and Resolution. Ideal for Jira, ServiceNow, or Zendesk.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-blue-400 font-bold mb-2">Professional Email</h4>
                <p className="text-sm">Converts casual thoughts into a polite, corporate-ready email. It automatically generates a subject line and ensures a professional tone suitable for clients or management.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-blue-400 font-bold mb-2">Meeting Minutes</h4>
                <p className="text-sm">Ideal for Project Managers. Turns random meeting notes into a structured report containing Objectives, Key Discussion Points, and clear Action Items for the team.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-blue-400 font-bold mb-2">Knowledge Base (KB) Article</h4>
                <p className="text-sm">Designed for documentation teams. It structures a solution into a formal Problem to Solution format, ready to be pasted into your internal wiki.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <strong className="text-white block">Is my data secure?</strong>
                <p>Yes. NoteRefiner processes text via API and sends it back immediately. We do not store your notes on our servers. Your "Saved History" is stored locally on your own device.</p>
              </div>
              <div>
                <strong className="text-white block">Is this tool free?</strong>
                <p>Yes, NoteRefiner is completely free to use. We aim to help professionals save time and improve communication standards across the industry.</p>
              </div>
            </div>
          </article>

        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-gray-950 text-center text-gray-500 text-sm py-8 border-t border-gray-800">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition">Terms of Service</a>
          <a href="/contact" className="hover:text-white transition">Contact Us</a>
        </div>
        <p>&copy; {new Date().getFullYear()} NoteRefiner. All rights reserved.</p>
      </footer>
    </div>
  );
}