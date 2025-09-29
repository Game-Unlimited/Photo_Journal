export async function base64ToBlob(base64Data: string, contentType: string): Promise<Blob> {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const arrayBuffer = new ArrayBuffer(len);
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: contentType });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const reader = new FileReader();
  const result = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const res = reader.result;
      if (typeof res === 'string') {
        const base64 = res.split(',')[1] ?? '';
        resolve(base64);
      } else {
        reject(new Error('Unexpected reader result'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
  return result;
}


