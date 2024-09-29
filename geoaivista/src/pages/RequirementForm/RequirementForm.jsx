import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import styles from "../../styles/RequirementForm.module.css";

const RequirementForm = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const { uploadedImage, setInvisibleLayer } = useUser(); // Access uploaded image and set invisible layer in context
  const [image, setImage] = useState(null); // Loaded image object for drawing
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  }); // Store image dimensions
  const [lines, setLines] = useState([]); // Store drawn lines (masking) for visible layer
  const [invisibleLines, setInvisibleLines] = useState([]); // Store drawn lines (masking) for invisible layer
  const [brushColor, setBrushColor] = useState("rgba(0, 0, 0, 0.5)"); // Default brush color with opacity
  const [brushSize, setBrushSize] = useState(20); // Default brush size
  const isDrawing = useRef(false); // To track whether user is drawing
  const stageRef = useRef(null); // Ref for the entire stage
  const invisibleLayerRef = useRef(null); // Ref for the invisible layer
  const navigate = useNavigate();

  // Load the uploaded image into an Image object
  useEffect(() => {
    if (uploadedImage) {
      const img = new window.Image();
      img.src = URL.createObjectURL(uploadedImage); // Create URL for the uploaded image
      img.onload = () => {
        setImage(img); // Set image when fully loaded
        setImageDimensions({ width: img.width, height: img.height }); // Set the image's original dimensions
      };
    }
  }, [uploadedImage]);

  // Start drawing when mouse is pressed
  const handleMouseDown = () => {
    isDrawing.current = true;
    setLines([...lines, []]); // Start a new line for visible layer
    setInvisibleLines([...invisibleLines, []]); // Start a new line for invisible layer
  };

  // Draw as the user moves the mouse
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition(); // Get the current pointer position

    // For visible layer
    const lastLine = lines[lines.length - 1];
    lastLine.push(point);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);

    // For invisible layer (synchronized drawing)
    const lastInvisibleLine = invisibleLines[invisibleLines.length - 1];
    lastInvisibleLine.push(point);
    invisibleLines.splice(invisibleLines.length - 1, 1, lastInvisibleLine);
    setInvisibleLines([...invisibleLines]);
  };

  // Stop drawing when the mouse is released
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Undo the last drawn line
  const handleUndo = () => {
    if (lines.length === 0) return; // Do nothing if no lines exist
    setLines(lines.slice(0, -1)); // Remove the last line from visible layer
    setInvisibleLines(invisibleLines.slice(0, -1)); // Remove the last line from invisible layer
  };

  // Download the invisible layer as an image
  const downloadMaskedImage = (dataURL) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "maskedImage.png"; // File name for the downloaded image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after download
  };

  // Store the invisible layer in context and download the image
  const handleSubmit = () => {
    const invisibleLayer = invisibleLayerRef.current.toDataURL(); // Get the invisible layer as an image
    setInvisibleLayer(invisibleLayer); // Store it in the context
    downloadMaskedImage(invisibleLayer); // Trigger the download of the image
    console.log("Selected Option:", selectedOption);
    navigate("/preview", { state: { selectedOption } });
  };

  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Land Use Planning Requirements</h1>
        <p className={styles.subtitle}>Edit your Image Here</p>

        <div className={styles.imageEditor}>
          {image ? (
            <div>
              <div className="toolbar">
                {/* Undo Button */}
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleUndo}
                >
                  <i
                    className="fas fa-undo-alt undo-icon"
                    style={{
                      fontSize: "24px",
                      color: "black",
                      marginLeft: "10px",
                    }}
                  ></i>
                </button>

                {/* Brush Settings */}
                <div className="brush-settings">
                  <label>Brush Color:</label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                  <label style={{ marginLeft: "20px" }}>Brush Size:</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              </div>

              {/* Konva Stage and Layers */}
              <div className="canvas-container">
                <Stage
                  ref={stageRef}
                  width={imageDimensions.width} // Set stage width to image's original width
                  height={imageDimensions.height} // Set stage height to image's original height
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  {/* Invisible Layer (Black Background) - placed first, so it is hidden */}
                  <Layer ref={invisibleLayerRef}>
                    <KonvaImage
                      width={imageDimensions.width}
                      height={imageDimensions.height}
                      fill="black"
                    />
                    {invisibleLines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.flatMap((point) => [point.x, point.y])} // Flatten points for Konva
                        stroke="white" // White marker on the black background for masking
                        strokeWidth={brushSize}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation="source-over"
                      />
                    ))}
                  </Layer>

                  {/* Visible Layer */}
                  <Layer>
                    {image && (
                      <KonvaImage
                        image={image}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                      />
                    )}
                    {lines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.flatMap((point) => [point.x, point.y])} // Flatten points for Konva
                        stroke={brushColor} // Use selected brush color
                        strokeWidth={brushSize} // Use selected brush size
                        tension={0.5} // Smooth the line
                        lineCap="round" // Round line ends
                        globalCompositeOperation="source-over" // Regular drawing
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            </div>
          ) : (
            <p>No image uploaded</p>
          )}
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default RequirementForm;
