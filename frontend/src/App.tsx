import { useState, useEffect } from "react";
import "./App.css";

type Note = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

type NoteResponse = {
  count: number;
  data: Note[];
};

function App() {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const result: NoteResponse = await response.json();
        setNotes(result.data);
      } catch {
        setError("Could not load notes. Please try again");
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  function handleAddNote() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      content: trimmedContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setNotes((currentNotes) => [...currentNotes, newNote]);
    setContent("");
  }

  function handleDeleteNote(idToDelete: number) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== idToDelete),
    );
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>QuickNote</h1>
        <p>Capture first. Organize later</p>
      </header>

      <section className="note-editor">
        <textarea
          placeholder="What's on your mind?"
          aria-label="Write a note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <button type="button" onClick={handleAddNote}>
          Add Note
        </button>
      </section>

      <section className="notes-section">
        <h2>Your Notes</h2>

        {loading ? (
          <p>Loading notes...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : notes.length === 0 ? (
          <p className="empty-state">No notes yet. Capture your first idea!</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="note-card">
                <p>{note.content}</p>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
