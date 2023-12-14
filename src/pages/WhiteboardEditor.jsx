// src/components/WhiteboardEditor.js
import { useRef, useEffect, useState } from 'react';

const WhiteboardEditor = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [brushColor, setBrushColor] = useState('#000');
  const [brushSize, setBrushSize] = useState(2);
  const [mode, setMode] = useState('pen'); // 'pen', 'rectangle', 'text', 'circle', 'line'
  const [text, setText] = useState('');
  const [rectStart, setRectStart] = useState({ x: 0, y: 0 });
  const [circleCenter, setCircleCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    setDrawing(true);

    if (mode === 'rectangle' || mode === 'text') {
      setRectStart({ x: e.clientX - canvasRef.current.offsetLeft, y: e.clientY - canvasRef.current.offsetTop });
    } else if (mode === 'circle') {
      setCircleCenter({ x: e.clientX - canvasRef.current.offsetLeft, y: e.clientY - canvasRef.current.offsetTop });
    } else {
      draw(e);
    }
  };

  const stopDrawing = () => {
    setDrawing(false);

    if (mode === 'rectangle') {
      drawRectangle();
    } else if (mode === 'text') {
      drawText();
    } else if (mode === 'circle') {
      drawCircle();
    } else {
      context.beginPath();
    }
  };

  const draw = (e) => {
    if (!drawing) return;

    const x = e.clientX - canvasRef.current.getBoundingClientRect().left;
    const y = e.clientY - canvasRef.current.getBoundingClientRect().top;

    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.strokeStyle = brushColor;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const drawRectangle = () => {
    const rectEnd = { x: rectStart.x + 100, y: rectStart.y + 50 }; // Adjust the size as needed
    context.fillStyle = brushColor;
    context.fillRect(rectStart.x, rectStart.y, rectEnd.x - rectStart.x, rectEnd.y - rectStart.y);
  };

  const drawText = () => {
    context.fillStyle = brushColor;
    context.font = `${brushSize * 5}px Arial`; // Adjust the font size as needed
    context.fillText(text, rectStart.x, rectStart.y + brushSize * 5);
  };

  const drawCircle = () => {
    const radius = 50; // Adjust the radius as needed
    context.fillStyle = brushColor;
    context.beginPath();
    context.arc(circleCenter.x, circleCenter.y, radius, 0, 2 * Math.PI);
    context.fill();
  };

  const handleColorChange = (e) => {
    setBrushColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value, 10));
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="flex mb-4 space-x-5">
        <input type="color" value={brushColor} onChange={handleColorChange} className="mr-2" />
        <input type="range" min="1" max="10" value={brushSize} onChange={handleSizeChange} />
        <button onClick={() => handleModeChange('pen')} className="ml-2"><span className='w-2 h-2 bg-blue-500 inline-block rounded-full mr-1'></span>Pen</button>
        <button onClick={() => handleModeChange('rectangle')} className="ml-2"><span className='w-2 h-2 bg-blue-500 inline-block rounded-full mr-1'></span>Rectangle</button>
        <button onClick={() => handleModeChange('text')} className="ml-2"><span className='w-2 h-2 bg-blue-500 inline-block rounded-full mr-1'></span>Text</button>
        <button onClick={() => handleModeChange('circle')} className="ml-2"><span className='w-2 h-2 bg-blue-500 inline-block rounded-full mr-1'></span>Circle</button>
        <button onClick={() => handleModeChange('line')} className="ml-2"><span className='w-2 h-2 bg-blue-500 inline-block rounded-full mr-1'></span>Line</button>
        <button onClick={clearCanvas} className="ml-2"><span className='w-2 h-2 bg-blue-500 inline-block rounded-full mr-1'></span>Clear Canvas</button>
      </div>
      {mode === 'text' && (
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text"
          className="mb-2 p-1 border border-gray-300"
        />
      )}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          className="border border-gray-300"
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          style={{ cursor: mode === 'pen' ? 'crosshair' : 'default' }}
        />
      </div>
    </div>
  );
};

export default WhiteboardEditor;
