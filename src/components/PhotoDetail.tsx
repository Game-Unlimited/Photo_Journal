import React from 'react';

import { PhotoEntry } from '../types';
import PhotoCard from './PhotoCard';

type Props = {
  entry: PhotoEntry;
  onBack: () => void;
  onEditTitle: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
};

export default function PhotoDetail(props: Props) {
  return <PhotoCard {...props} />;
}


