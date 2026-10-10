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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoadError(null);

        const response = await fetch("/api/notes");

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const result: NoteResponse = await response.json();
        setNotes(result.data);
      } catch {
        setLoadError("Could not load notes. Please try again");
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  async function handleAddNote() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setActionError(null);

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const result: { data: Note } = await response.json();

      setNotes((currentNotes) => [result.data, ...currentNotes]);

      setContent("");
    } catch {
      setActionError("Could not save note. Please try again");
    }
  }

  function handleStartEdit(note: Note) {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setEditContent("");
  }

  async function handleSaveEdit() {
    if (editingNoteId === null) {
      return;
    }

    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      setActionError("Note content cannot be empty");
      return;
    }

    try {
      setActionError(null);

      const response = await fetch(`/api/notes/${editingNoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const result: { data: Note } = await response.json();

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNoteId ? result.data : note,
        ),
      );

      handleCancelEdit();
    } catch {
      setActionError("Could not update note. Please try again");
    }
  }

  async function handleDeleteNote(idToDelete: number) {
    try {
      setActionError(null);

      const response = await fetch(`/api/notes/${idToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== idToDelete),
      );
    } catch {
      setActionError("Could not delete note. Please try again");
    }
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

        {actionError && <p role="alert">{actionError}</p>}

        {loading ? (
          <p>Loading notes...</p>
        ) : loadError ? (
          <div>
            <p role="alert">{loadError}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : notes.length === 0 ? (
          <p className="empty-state">No notes yet. Capture your first idea!</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="note-card">
                {editingNoteId === note.id ? (
                  <div className="edit-form">
                    <textarea
                      aria-label="Edit note content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    ></textarea>

                    <div className="note-actions">
                      <button type="button" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button type="button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{note.content}</p>

                    <div className="note-actions">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
