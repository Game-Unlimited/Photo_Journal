import React from 'react';

import { PhotoEntry } from '../types';

type Props = {
  entries: PhotoEntry[];
  onOpen: (id: string) => void;
};

export default function Gallery({ entries, onOpen }: Props) {
  return (
    <div className="grid">
      {entries.map((e) => (
        <button key={e.id} className="card" onClick={() => onOpen(e.id)} aria-label={e.title}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img className="thumb" src={e.webPath ?? e.fileUri} />
          <div className="card-body">
            <div className="card-title">{e.title || 'Ảnh chưa có tiêu đề'}</div>
            <div>{new Date(e.createdAt).toLocaleString()}</div>
          </div>
        </button>
      ))}
    </div>
  );
}


