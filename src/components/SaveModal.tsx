import React, { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  defaultTitle?: string;
  onClose: () => void;
  onSave: (title: string) => void;
};

export default function SaveModal({ open, defaultTitle, onClose, onSave }: Props) {
  const [title, setTitle] = useState<string>(defaultTitle ?? '');

  useEffect(() => {
    setTitle(defaultTitle ?? '');
  }, [defaultTitle, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Nhập tiêu đề ảnh</h3>
        <input
          className="input"
          placeholder="Ví dụ: Hoàng hôn ngày 01/10"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="space"></div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn secondary" onClick={onClose}>Hủy</button>
          <button className="btn" onClick={() => onSave(title.trim())} disabled={!title.trim()}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}


