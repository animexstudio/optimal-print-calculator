import React, { useState, useRef } from 'react';

const OptimalPrintCalculator = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [results, setResults] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Standard US print sizes grouped by orientation
  const standardSizes = {
    landscape: [
      { width: 7, height: 5 },
      { width: 10, height: 8 },
      { width: 11, height: 8.5 },
      { width: 14, height: 11 },
      { width: 18, height: 12 },
      { width: 20, height: 16 },
      { width: 24, height: 16 },
      { width: 24, height: 18 },
      { width: 24, height: 20 },
      { width: 30, height: 20 },
      { width: 36, height: 24 },
      { width: 40, height: 30 }
    ],
    portrait: [
      { width: 5, height: 7 },
      { width: 8, height: 10 },
      { width: 8.5, height: 11 },
      { width: 11, height: 14 },
      { width: 12, height: 18 },
      { width: 16, height: 20 },
      { width: 16, height: 24 },
      { width: 18, height: 24 },
      { width: 20, height: 24 },
      { width: 20, height: 30 },
      { width: 24, height: 36 },
      { width: 30, height: 40 }
    ],
    square: [
      { width: 8, height: 8 },
      { width: 10, height: 10 },
      { width: 12, height: 12 },
      { width: 16, height: 16 },
      { width: 20, height: 20 }
    ]
  };
  
  // DPI levels for calculation
  const dpiLevels = [300, 150, 100];
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }
    
    setFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = parseFloat((width / height).toFixed(2));
        
        let orientation;
        if (Math.abs(aspectRatio - 1) < 0.05) {
          orientation = 'square';
        } else if (width > height) {
          orientation = 'landscape';
        } else {
          orientation = 'portrait';
        }
        
        const data = {
          width,
          height,
          aspectRatio,
          orientation
        };
        
        setImageData(data);
        calculateOptimalSizes(data);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  const calculateOptimalSizes = (data) => {
    const { width, height, aspectRatio, orientation } = data;
    const result = {};
    
    dpiLevels.forEach(dpi => {
      const maxWidthInches = width / dpi;
      const maxHeightInches = height / dpi;
      
      // Filter standard sizes based on orientation and max printable size
      let filteredSizes = standardSizes[orientation].filter(size => {
        // Check if the size fits within max printable dimensions
        if (size.width > maxWidthInches || size.height > maxHeightInches) {
          return false;
        }
        
        // Check if aspect ratio matches within tolerance (2%)
        const sizeRatio = size.width / size.height;
        const tolerance = 0.02; // 2%
        
        if (orientation === 'landscape' || orientation === 'portrait') {
          return Math.abs(sizeRatio - aspectRatio) / aspectRatio <= tolerance;
        }
        return true; // For square images, all square sizes are valid
      });
      
      // Sort by size (larger first)
      filteredSizes.sort((a, b) => (b.width * b.height) - (a.width * a.height));
      
      result[dpi] = filteredSizes.map(size => `${size.width}×${size.height}`);
    });
    
    setResults(result);
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const resetCalculator = () => {
    setFile(null);
    setPreview(null);
    setImageData(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Optimal Print Size Calculator</h1>
      
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mb-2 text-lg font-semibold">Drag & drop your image here</p>
            <p className="text-sm text-gray-500">or click to browse files</p>
            <p className="mt-2 text-xs text-gray-400">Supported formats: JPG, PNG, WebP (max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <img src={preview} alt="Preview" className="w-full h-auto" />
              </div>
              <button 
                onClick={resetCalculator}
                className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium"
              >
                Upload Different Image
              </button>
            </div>
            
            <div className="md:w-2/3">
              {imageData && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Image Analysis</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Dimensions</p>
                        <p className="font-medium">{imageData.width} × {imageData.height} px</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Orientation</p>
                        <p className="font-medium capitalize">{imageData.orientation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Aspect Ratio</p>
                        <p className="font-medium">{imageData.aspectRatio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {results && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Optimal Print Sizes</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left">Quality</th>
                          <th className="py-3 px-4 text-left">DPI</th>
                          <th className="py-3 px-4 text-left">Recommended Sizes (inches)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium text-green-600">Excellent</td>
                          <td className="py-3 px-4 border-b">300 DPI</td>
                          <td className="py-3 px-4 border-b">
                            {results[300] && results[300].length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {results[300].map((size, index) => (
                                  <span key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm">
                                    {size}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">No standard sizes match</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium text-yellow-600">Good</td>
                          <td className="py-3 px-4 border-b">150 DPI</td>
                          <td className="py-3 px-4 border-b">
                            {results[150] && results[150].length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {results[150].map((size, index) => (
                                  <span key={index} className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-sm">
                                    {size}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">No standard sizes match</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-orange-600">Acceptable</td>
                          <td className="py-3 px-4">100 DPI</td>
                          <td className="py-3 px-4">
                            {results[100] && results[100].length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {results[100].map((size, index) => (
                                  <span key={index} className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-sm">
                                    {size}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">No standard sizes match</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p><strong>DPI (Dots Per Inch)</strong> indicates print quality:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><span className="text-green-600 font-medium">300 DPI</span>: Professional quality, suitable for close viewing</li>
                      <li><span className="text-yellow-600 font-medium">150 DPI</span>: Good quality, suitable for wall art viewed from a few feet away</li>
                      <li><span className="text-orange-600 font-medium">100 DPI</span>: Acceptable for large formats viewed from a distance</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimalPrintCalculator;