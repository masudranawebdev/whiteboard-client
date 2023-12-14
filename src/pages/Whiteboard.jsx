import { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import axios from 'axios';

const WhiteboardApp = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('red');
  const [shape, setShape] = useState('pen');
  const [text, setText] = useState('');
  const [cursorType, setCursorType] = useState('default');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    context.closePath();
    setDrawing(false);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleShapeChange = (selectedShape) => {
    setShape(selectedShape);
    setCursorType(selectedShape === 'text' ? 'text' : 'crosshair');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleCursorChange = (cursor) => {
    setCursorType(cursor);
  };

  const saveToDatabase = async () => {
    const imageData = canvasRef.current.toDataURL();
    
    try {
      await axios.post('/api/save', { imageData, text });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex space-x-4">
        <div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className={`border border-gray-800 cursor-${cursorType}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseOut={endDrawing}
            color={color}
          />
        </div>
        <div>
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
          <div className="mt-4">
            <label className="block text-gray-700">Shape:</label>
            <select
              className="mt-1 p-2 border border-gray-400 rounded"
              onChange={(e) => handleShapeChange(e.target.value)}
            >
              <option value="pen">Pen</option>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
              <option value="text">Text</option>
            </select>
          </div>
          {shape === 'pen' && (
            <div className="mt-4">
              <label className="block text-gray-700">Pen Size:</label>
              <input
                type="range"
                min="1"
                max="10"
                value="1"
                className="mt-1 p-2 border border-gray-400 rounded"
              />
            </div>
          )}
          {shape === 'text' && (
            <div className="mt-4">
              <label className="block text-gray-700">Text:</label>
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                className="mt-1 p-2 border border-gray-400 rounded"
              />
            </div>
          )}
          <div className="mt-4">
            <label className="block text-gray-700">Cursor:</label>
            <select
              className="mt-1 p-2 border border-gray-400 rounded"
              onChange={(e) => handleCursorChange(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="pointer">Pointer</option>
              <option value="text">Text</option>
              <option value="crosshair">Crosshair</option>
            </select>
          </div>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={clearCanvas}
          >
            Clear Canvas
          </button>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={saveToDatabase}
          >
            Save to Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardApp;
