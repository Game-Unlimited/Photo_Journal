import React, { useEffect, useMemo, useState } from 'react';

import Gallery from './components/Gallery';
import PhotoDetail from './components/PhotoDetail';
import SaveModal from './components/SaveModal';
import { deleteEntry, loadEntries, saveEntry, shareEntry, takeAndSavePhoto, updateTitle } from './services/photoService';
import { PhotoEntry } from './types';

export default function App() {
  const [entries, setEntries] = useState<PhotoEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<PhotoEntry | null>(null);

  useEffect(() => {
    void (async () => {
      const loaded = await loadEntries();
      setEntries(loaded);
    })();
  }, []);

  const selected = useMemo(() => entries.find((e) => e.id === selectedId) ?? null, [entries, selectedId]);

  const handleCapture = async () => {
    const temp = await takeAndSavePhoto();
    setPendingEntry(temp);
    setOpenModal(true);
  };

  const handleSaveTitle = async (title: string) => {
    if (!pendingEntry) return;
    const entry: PhotoEntry = { ...pendingEntry, title };
    await saveEntry(entry);
    setEntries((prev) => [entry, ...prev]);
    setPendingEntry(null);
    setOpenModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
  };

  const handleEditTitle = async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setPendingEntry(entry);
    setOpenModal(true);
  };

  const handleUpdateTitle = async (title: string) => {
    const entry = pendingEntry;
    if (!entry) return;
    await updateTitle(entry.id, title);
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, title } : e)));
    setPendingEntry(null);
    setOpenModal(false);
  };

  const handleShare = async (id: string) => {
    await shareEntry(id);
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="title">Photo Journal</h1>
        <button className="btn" onClick={handleCapture}>Chụp ảnh</button>
      </div>
      <div className="container">
        {selected ? (
          <PhotoDetail
            entry={selected}
            onBack={() => setSelectedId(null)}
            onEditTitle={handleEditTitle}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        ) : (
          <Gallery entries={entries} onOpen={(id) => setSelectedId(id)} />
        )}
      </div>

      <SaveModal
        open={openModal}
        defaultTitle={pendingEntry?.title ?? ''}
        onClose={() => {
          setOpenModal(false);
          setPendingEntry(null);
        }}
        onSave={(t) => (pendingEntry && entries.some((e) => e.id === pendingEntry.id) ? handleUpdateTitle(t) : handleSaveTitle(t))}
      />
    </div>
  );
}


