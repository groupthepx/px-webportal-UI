import React, { useEffect, useState } from 'react';
import { Fade } from '@mui/material';

interface TypedTextProps {
  text: string;
  typingSpeed?: number; // Optional typing speed prop
}

const TypedText: React.FC<TypedTextProps> = ({ text, typingSpeed = 100 }) => {
  const [typedText, setTypedText] = useState<string>('');
  const [visibleChars, setVisibleChars] = useState<number>(0); // Track the visible characters

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(text.slice(0, index + 1));
      setVisibleChars((prev) => prev + 1); // Increment the visible characters count
      index++;
      if (index >= text.length) clearInterval(typingInterval);
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [text, typingSpeed]);

  return (
    <>
      {typedText.split('').map((char, index) => (
        <Fade in={index < visibleChars} timeout={300} key={index}>
          <span>{char}</span>
        </Fade>
      ))}
    </>
  );
};

export default TypedText;
