import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css"; // Create App.css for your styles

function Home() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false); // Track if interaction has happened
  const progressBarRef = useRef(null);
  const [ApiResponse, setApiResponse] = useState();
  const [Id, setId] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles((prevUploadedFiles) => [
      ...prevUploadedFiles,
      ...acceptedFiles,
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const cartonize = async () => {
    const ImageFormData = new FormData();
    uploadedFiles?.map((item, i) => {
      ImageFormData.append("images", item);
    });
    axios({
      method: "POST",
      url: "https://e0aa-49-205-80-136.ngrok-free.app/Api/upload/",
      data: ImageFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setApiResponse(res.data.data);
        setId(res.data.id);
      })
      .catch((error) => {
        console.error("API error", error);
      });
  };

  const handleDownload = async () => {
    if (Id !== undefined && Id !== null) {
      const primaryKeys = Object.values(Id);
      const body = {
        primary_keys: primaryKeys,
      };
      try {
        const response = await axios.post(
          "https://e0aa-49-205-80-136.ngrok-free.app/Api/download/",
          body,
          {
            responseType: "blob", // Set the response type to 'blob' to get binary data
          }
        );

        // Create a Blob with the response data
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary link element and trigger a download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "downloaded_file.zip");
        document.body.appendChild(link);
        link.click();

        // Clean up after download
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("API error", error);
      }
    } else {
      console.error("Id is not defined or null");
    }
  };

  const staticUrl = "https://e0aa-49-205-80-136.ngrok-free.app";

  const stages = [
    { label: 'We will comeback with good models thanks for the review', color: '#FF5733' },
    { label: 'Thanks for this review we will try to improve the model', color: '#FFC300' },
    { label: 'Thanks for the review we really appreciate', color: '#4CAF50' },
    { label: 'Thanks for the review and choosing our model to cartoonize', color: '#00BCD4' },
  ];

  const calculateProgress = (clientX) => {
    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const offsetX = clientX - progressBarRect.left;
    const newProgress = Math.min(Math.max((offsetX / progressBarRect.width) * 100, 0), 100);

    const stageIndex = Math.floor(newProgress / 25);
    if (stages[stageIndex]) {
      const stageColor = stages[stageIndex].color;
      progressBarRef.current.style.background = `linear-gradient(to right, ${stageColor} ${newProgress}%, #eee ${newProgress}%)`;
      progressBarRef.current.style.setProperty('--progress-bar-color', stageColor);
    }

    return newProgress;
  };

  const handleMouseDown = (event) => {
    const newProgress = calculateProgress(event.clientX);
    setProgress(newProgress);
    setHasInteracted(true); // Interaction happened, show the message
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const newProgress = calculateProgress(event.clientX);
    setProgress(newProgress);
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const getLabel = () => {
    for (let i = 0; i < stages.length; i++) {
      if (progress < (i + 1) * 25) {
        return stages[i].label;
      }
    }
    return stages[stages.length - 1].label;
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{ fontSize: "3rem", paddingBottom: "1rem", color: "black" }}
          >
            White Box Cartoonization
          </h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div style={{ display: "flex" }}>
                  <div
                    {...getRootProps()}
                    className={`upload-btn ${isDragActive ? "active" : ""}`}
                  >
                    <input {...getInputProps()} />
                    {isDragActive
                      ? "Drop the files here"
                      : "Click to Upload Images"}
                  </div>
                  <div className="convert">
                    <button
                      onClick={() => {
                        cartonize();
                      }}
                    >
                      Cartoonize
                    </button>
                  </div>
                </div>
                <div className="file-list">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index}`}
                        className="thumbnail"
                      />
                      <span className="file-name">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    marginBottom: "1rem",
                    justifyContent: "space-evenly",
                  }}
                >
                  <h2 style={{ fontSize: "2rem", textAlign: "center" }}>
                    Cartoonized Images
                  </h2>
                  <button
                    className="download"
                    onClick={() => {
                      handleDownload();
                    }}
                  >
                    {" "}
                    Download
                  </button>
                </div>
                <div className="row">
                  {ApiResponse?.map((img, i) => {
                    console.log(ApiResponse,"ApiResponse")
                    return (
                      <>
                        <div className="col-lg-6">
                          <img
                            key={i}
                            src={`${staticUrl}${img}`}
                            alt="cartonise"
                            style={{
                              width: "100%",
                              maxWidth: "300px",
                              height: "200px",
                              margin: "0px 0px 10px 10px",
                              border: "solid 1px",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                      </>
                    );
                  })}
                  {ApiResponse && ApiResponse.length > 0 && (
                    <div className="five-stage-progress">
                      <div className="ratings">
                        <h2>Overall Ratings</h2>
                      </div>
                      <div className="progress-icons" ref={progressBarRef} onMouseDown={handleMouseDown}>
                        {stages.map((stage, index) => (
                          <div
                            key={index}
                            className={`progress-icon ${progress >= (index + 1) * 25 ? 'filled' : ''}`}
                            style={{
                              backgroundColor: stage.color,
                              borderRadius: '50%',
                              width: '50px',
                              height: '50px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      {hasInteracted && (
                        <div className="progress-label" style={{ color: getLabel() }}>
                          {getLabel()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ fontSize: "18px", padding: "2rem 1rem 0rem 0rem", color: "black",fontWeight:"bold" }}>
            👉 Presented as part of the Demo Project @ ColanInfotech
          </h4>
          {/* <h4 style={{ fontSize: "18px", color: "black",fontWeight:"bold" }}>
            👷 Project Authors: Raiyan 
          </h4> */}
        </div>
      </div>
    </>
  );
}

export default Home;
