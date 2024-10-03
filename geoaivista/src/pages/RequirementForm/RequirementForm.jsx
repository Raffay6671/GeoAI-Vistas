import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Stage, Layer, Image as KonvaImage, Line, Circle } from "react-konva";
import styles from "../../styles/RequirementForm.module.css";

const RequirementForm = () => {
  const [shapeType, setShapeType] = useState(""); // State to track shape selection or free drawing
  const [points, setPoints] = useState([]); // Points for pinning and connecting functionality
  const [lines, setLines] = useState([]); // Store drawn lines for visible layer (marker)
  const [actions, setActions] = useState([]); // Unified action stack for both marker and pin points
  const [brushColor, setBrushColor] = useState("rgba(0, 0, 0, 0.5)"); // Default brush color with opacity
  const [brushSize, setBrushSize] = useState(20); // Default brush size
  const isDrawing = useRef(false); // To track whether user is drawing
  const stageRef = useRef(null); // Ref for the entire stage
  const invisibleLayerRef = useRef(null); // Ref for the invisible layer
  const navigate = useNavigate();
  const { uploadedImage, setInvisibleLayer } = useUser(); // Access uploaded image and set invisible layer in context
  const [image, setImage] = useState(null); // Loaded image object for drawing
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  }); // Store image dimensions

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

  // Pinning logic: Start pinning points or drawing lines based on selected tool
  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition(); // Get the current mouse position

    if (shapeType === "pin") {
      // Add pin point action
      setPoints((prevPoints) => {
        const updatedPoints = [...prevPoints, pointerPosition];
        setActions([...actions, { type: "pin", points: updatedPoints }]); // Record action in unified stack
        return updatedPoints;
      });
    } else if (shapeType === "marker") {
      // Start drawing marker lines
      isDrawing.current = true;
      const newLine = [pointerPosition];
      setLines([...lines, newLine]); // Start a new line for visible layer
      setActions([...actions, { type: "marker", lines: [...lines, newLine] }]); // Record action in unified stack
    }
  };

  // Draw as the user moves the mouse (for brush drawing)
  const handleMouseMove = (e) => {
    if (!isDrawing.current || shapeType === "pin") return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition(); // Get the current pointer position

    // For visible layer (marker)
    const lastLine = lines[lines.length - 1];
    lastLine.push(point);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);

    // Update the last action in the unified stack
    const updatedActions = [...actions];
    updatedActions[updatedActions.length - 1].lines = [...lines];
    setActions(updatedActions);
  };

  // Stop drawing when the mouse is released (for brush drawing)
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Undo the last drawn line or point, regardless of the tool used
  const handleUndo = () => {
    if (actions.length === 0) return; // Do nothing if no actions exist

    const lastAction = actions[actions.length - 1];
    if (lastAction.type === "pin") {
      setPoints(lastAction.points.slice(0, -1)); // Remove the last pin point
    } else if (lastAction.type === "marker") {
      setLines(lastAction.lines.slice(0, -1)); // Remove the last marker line
    }

    // Remove the last action from the unified stack
    setActions(actions.slice(0, -1));
  };

  // Download the invisible layer as an image (with mask)
  const downloadMaskedImage = (dataURL) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "maskedImage.png"; // File name for the downloaded image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after download
  };

  // Store the invisible layer in context and download the image
  const handleSubmit = async () => {
    const invisibleLayer = invisibleLayerRef.current.toDataURL(); // Get the invisible layer as an image
    setInvisibleLayer(invisibleLayer); // Store it in the context

    // Download the invisible layer as an image
    downloadMaskedImage(invisibleLayer); // Call the function to download the masked image

    const maskBlob = dataURLToBlob(invisibleLayer);
    const formData = new FormData();
    formData.append("image", uploadedImage);
    formData.append("mask", maskBlob, "mask.png");

    try {
      const response = await axios.post(
        "http://localhost:5006/inpaint",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );
      const maskBlob = response.data;
      const blobUrl = URL.createObjectURL(maskBlob);
      sessionStorage.setItem("maskBlobUrl", blobUrl);

      console.log("Files uploaded successfully!", response.data);
    } catch (error) {
      console.error("Error uploading files.", error);
    }

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
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#3d8540",
                    color: "white",
                    border: "none",
                    borderRadius: "3rem",
                    cursor: "pointer",
                    marginBottom: "20px",
                    marginRight: "10px",
                    transition: "transform 0.2s, backgroundColor 0.2s",
                  }}
                  onClick={handleUndo}
                >
                  <FontAwesomeIcon icon={faUndoAlt} className="undo-icon" />
                  Undo
                </button>

                {/* Button for Marker */}
                <button
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#3d8540",
                    color: "white",
                    border: "none",
                    borderRadius: "3rem",
                    cursor: "pointer",
                    marginBottom: "20px",
                    marginRight: "10px",
                    transition: "transform 0.2s, backgroundColor 0.2s",
                  }}
                  onClick={() => setShapeType("marker")}
                >
                  Use Marker
                </button>

                {/* Button for Pinning Points */}
                <button
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#3d8540",
                    color: "white",
                    border: "none",
                    borderRadius: "3rem",
                    cursor: "pointer",
                    marginBottom: "20px",
                    transition: "transform 0.2s, backgroundColor 0.2s",
                  }}
                  onClick={() => setShapeType("pin")}
                >
                  Pin Points
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
                    {/* Invisible lines drawn for masking */}
                    {lines.map((line, i) => (
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

                    {/* Pinning Points Logic for Mask */}
                    {points.length > 1 && (
                      <Line
                        points={points.flatMap((p) => [p.x, p.y])} // Flatten array of points into a single array
                        stroke="white" // Use white color for mask
                        strokeWidth={brushSize}
                        closed={true} // Close the shape to form an enclosed area
                        fill="white" // Fill the shape with white to form the mask
                        lineCap="round"
                        lineJoin="round"
                      />
                    )}
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

                    {/* Render all pinned points */}
                    {points.map((point, index) => (
                      <Circle
                        key={index}
                        x={point.x}
                        y={point.y}
                        radius={5} // Simple black pointer
                        fill="black"
                      />
                    ))}

                    {/* Draw lines connecting points */}
                    {points.length > 1 && (
                      <Line
                        points={points.flatMap((p) => [p.x, p.y])} // Ensure points are flattened in the correct order
                        stroke={brushColor} // Use selected brush color for lines
                        strokeWidth={brushSize}
                        closed={false} // Keep shape open until the user decides to close it
                        lineCap="round"
                        lineJoin="round"
                      />
                    )}

                    {/* Brush drawing lines */}
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
