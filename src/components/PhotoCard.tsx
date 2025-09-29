import React from 'react';

import { PhotoEntry } from '../types';

type Props = {
  entry: PhotoEntry;
  onBack: () => void;
  onEditTitle: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
};

export default function PhotoCard({ entry, onBack, onEditTitle, onDelete, onShare }: Props) {
  return (
    <div className="detail">
      <button className="btn secondary" onClick={onBack}>Quay lại</button>
      <div className="space"></div>
      <img src={entry.webPath ?? entry.fileUri} alt={entry.title || 'photo'} />
      <div className="detail-meta">
        <div className="card-title" style={{ fontSize: 18 }}>{entry.title || 'Chưa có tiêu đề'}</div>
        <div>{new Date(entry.createdAt).toLocaleString()}</div>
      </div>
      <div className="detail-actions">
        <button className="btn" onClick={() => onEditTitle(entry.id)}>Sửa tiêu đề</button>
        <button className="btn danger" onClick={() => onDelete(entry.id)}>Xóa</button>
        <button className="btn secondary" onClick={() => onShare(entry.id)}>Chia sẻ</button>
      </div>
    </div>
  );
}


