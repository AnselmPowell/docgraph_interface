// src/app/components/research/UploadSection/utils.js
export const validateInput = {
    files: (files) => files && files.length > 0,
    
    context: (text) => {
      const words = text.trim().split(/\s+/);
      return words.length >= 10 && words.length <= 200;
    },
    
    theme: (theme) => theme && theme.name && theme.name.trim().length >= 2,
    
    keyword: (keyword) => {
      const cleaned = keyword.trim().toLowerCase();
      return cleaned.length >= 2 && cleaned.length <= 30;
    }
  };
  
  export const formatFileName = (name) => {
    if (name.length <= 25) return name;
    const ext = name.split('.').pop();
    return `${name.substring(0, 20)}...${ext}`;
  };
  
  export const getFileIcon = (type) => {
    switch (type) {
      case 'application/pdf':
        return 'FilePdf';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'FileText';
      case 'text/plain':
        return 'FileText';
      default:
        return 'File';
    }
  };