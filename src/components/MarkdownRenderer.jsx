import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MarkdownRenderer = ({ content }) => {
  const renderContent = (text) => {
    if (!text) return null;

    // Satırları böl
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Boş satırları paragraf olarak render et
      if (line.trim() === '') {
        return <Box key={index} sx={{ mb: 1 }} />;
      }

      // Özel fotoğraf işaretleyicisi kontrol et
      if (line.trim().startsWith('[IMAGE:') && line.includes(']')) {
        const match = line.match(/\[IMAGE:([^|]+)(?:\|([^\]]+))?\]/);
        if (match) {
          const [, src, caption] = match;
          return (
            <Box key={index} sx={{ my: 2, textAlign: 'center' }}>
              <img
                src={src}
                alt={caption || 'Blog fotoğrafı'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {caption && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1, 
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  {caption}
                </Typography>
              )}
            </Box>
          );
        }
      }

      // Başlık kontrol et
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s*/, '');
        
        const variantMap = {
          1: 'h4',
          2: 'h5',
          3: 'h6',
          4: 'subtitle1',
          5: 'subtitle2',
          6: 'body1'
        };
        
        return (
          <Typography
            key={index}
            variant={variantMap[level] || 'body1'}
            sx={{
              fontWeight: 600,
              color: '#5A0058',
              mt: level === 1 ? 3 : 2,
              mb: 1
            }}
          >
            {text}
          </Typography>
        );
      }

      // Kalın metin kontrol et
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <Typography key={index} variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <strong key={partIndex}>{part}</strong>
              ) : (
                <span key={partIndex}>{part}</span>
              )
            )}
          </Typography>
        );
      }

      // İtalik metin kontrol et
      if (line.includes('*') && !line.startsWith('*')) {
        const parts = line.split('*');
        return (
          <Typography key={index} variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <em key={partIndex}>{part}</em>
              ) : (
                <span key={partIndex}>{part}</span>
              )
            )}
          </Typography>
        );
      }

      // Link kontrol et
      if (line.includes('[') && line.includes('](') && line.includes(')')) {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        const elements = [];
        let match;
        
        while ((match = linkRegex.exec(line)) !== null) {
          // Link öncesi metin
          if (match.index > lastIndex) {
            elements.push(
              <span key={`text-${lastIndex}`}>
                {line.substring(lastIndex, match.index)}
              </span>
            );
          }
          
          // Link
          elements.push(
            <a
              key={`link-${match.index}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#5A0058',
                textDecoration: 'underline',
                fontWeight: 500
              }}
            >
              {match[1]}
            </a>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Kalan metin
        if (lastIndex < line.length) {
          elements.push(
            <span key={`text-${lastIndex}`}>
              {line.substring(lastIndex)}
            </span>
          );
        }
        
        return (
          <Typography key={index} variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
            {elements}
          </Typography>
        );
      }

      // Normal paragraf
      return (
        <Typography key={index} variant="body1" sx={{ 
          mb: 1, 
          lineHeight: 1.8,
          fontSize: '1.1rem',
          color: '#333',
          fontWeight: 400,
          textAlign: 'justify'
        }}>
          {line}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ 
      '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      },
      '& a': {
        color: '#5A0058',
        textDecoration: 'underline',
        fontWeight: 500,
        '&:hover': {
          color: '#4A0047'
        }
      }
    }}>
      {renderContent(content)}
    </Box>
  );
};

export default MarkdownRenderer; 