import { File, FileImage, FileText } from 'lucide-react';

/** @param {{type?: string, className?: string}} props */
const FileIcon = ({ type = 'Other', className = 'h-6 w-6' }) => {
  const normalized = String(type).toLowerCase();
  if (normalized.includes('pdf') || normalized.includes('doc')) return <FileText className={className} aria-hidden="true" />;
  if (normalized.includes('image') || normalized.includes('jpg') || normalized.includes('png')) return <FileImage className={className} aria-hidden="true" />;
  return <File className={className} aria-hidden="true" />;
};

export default FileIcon;
