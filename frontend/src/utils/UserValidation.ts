// utils/UserValidation.ts

// Since most fields are now read-only and imported from GitHub,
// we only need basic validation utilities for file handling

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(fileExtension);
};

export const validateFileSize = (file: File, maxSizeMB: number = 1.5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateResumeFile = (file: File): string | null => {
  if (!validateFileType(file)) {
    return "Please upload a PDF or Word document (.pdf, .doc, .docx)";
  }
  
  if (!validateFileSize(file)) {
    return "File size must be less than 1.5MB";
  }
  
  return null;
};

// Keep these for any legacy code that might still reference them
export interface TouchedFields {
  firstName: boolean;
  lastName: boolean;
  middleName: boolean;
  email: boolean;
  phone: boolean;
  password?: boolean;
  confirmPassword?: boolean;
}

// Simplified format phone number function (for display purposes only)
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length >= 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return cleaned;
  }
};