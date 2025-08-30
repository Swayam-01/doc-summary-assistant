// // import React, { useState } from "react";
// // import SummaryView from "./SummaryView";

// // export default function UploadArea() {
// //   const [file, setFile] = useState(null);
// //   const [length, setLength] = useState("MEDIUM");
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [error, setError] = useState(null);

// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setError(null);
// //     if (!file) return setError("Please choose a file first.");
// //     const fd = new FormData();
// //     fd.append("file", file);
// //     fd.append("length", length);

// //     setLoading(true);
// //     setResult(null);

// //     try {
// //       const res = await fetch("http://localhost:8000/api/process", {
// //         method: "POST",
// //         body: fd,
// //       });
// //       if (!res.ok) {
// //         const err = await res.json().catch(() => ({}));
// //         throw new Error(err.detail || `Server error: ${res.status}`);
// //       }
// //       const data = await res.json();
// //       setResult(data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <>
// //       <div className="card">
// //         <form onSubmit={handleSubmit}>
// //           <div>
// //             <label style={{ fontWeight: 600 }}>Choose file (PDF or image):</label><br />
// //             <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files[0])} />
// //           </div>

// //           <div style={{ marginTop: 10 }}>
// //             <label style={{ fontWeight: 600 }}>Summary length:</label>
// //             <select value={length} onChange={(e) => setLength(e.target.value)}>
// //               <option value="SHORT">Short</option>
// //               <option value="MEDIUM">Medium</option>
// //               <option value="LONG">Long</option>
// //             </select>
// //             <button type="submit" style={{ marginLeft: 12 }} disabled={loading}>
// //               {loading ? "Processing..." : "Summarize"}
// //             </button>
// //           </div>
// //         </form>

// //         {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}
// //       </div>

// //       {loading && (
// //         <div className="card">
// //           <p>Processing — this may take a minute for long documents (models download on first run).</p>
// //         </div>
// //       )}

// //       {result && <SummaryView result={result} />}
// //     </>
// //   );
// // }


// import React, { useRef, useState } from "react";
// import SummaryView from "./SummaryView";

// export default function UploadArea() {
//   const fileRef = useRef();
//   const [dragOver, setDragOver] = useState(false);
//   const [file, setFile] = useState(null);
//   const [length, setLength] = useState("MEDIUM");
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   function handleFiles(files) {
//     if (!files || files.length === 0) return;
//     setFile(files[0]);
//     setError("");
//     setResult(null);
//   }

//   function onDrop(e) {
//     e.preventDefault();
//     setDragOver(false);
//     const dt = e.dataTransfer;
//     const files = dt?.files;
//     handleFiles(files);
//   }

//   function onSelect(e) {
//     handleFiles(e.target.files);
//   }

//   function clearFile() {
//     setFile(null);
//     fileRef.current.value = "";
//   }

//   function upload() {
//     if (!file) return setError("Choose a file first");
//     setLoading(true);
//     setProgress(0);
//     setError("");
//     setResult(null);

//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("length", length);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "http://localhost:8000/api/process", true);

//     xhr.upload.onprogress = function (e) {
//       if (e.lengthComputable) {
//         const pct = Math.round((e.loaded / e.total) * 100);
//         setProgress(pct);
//       }
//     };

//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//         setLoading(false);
//         setProgress(100);
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             const json = JSON.parse(xhr.responseText);
//             setResult(json);
//           } catch (err) {
//             setError("Invalid server response");
//           }
//         } else {
//           try {
//             const json = JSON.parse(xhr.responseText);
//             setError(json.detail || `Server error ${xhr.status}`);
//           } catch {
//             setError(`Server error ${xhr.status}`);
//           }
//         }
//       }
//     };

//     xhr.onerror = function () {
//       setLoading(false);
//       setError("Network error: failed to upload");
//     };

//     xhr.send(fd);
//   }

//   return (
//     <div className="upload">
//       <div
//         className={`dropzone ${dragOver ? "dragover" : ""}`}
//         onDrop={onDrop}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//       >
//         <div className="left">
//           <svg viewBox="0 0 24 24" fill="none" aria-hidden>
//             <path d="M12 3v10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//             <path d="M7 10l5-5 5 5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>

//         <div className="meta">
//           <strong>{file ? file.name : "Drop file here or click to upload"}</strong>
//           <p className="muted">{file ? `${(file.size/1024).toFixed(1)} KB` : "Supports: PDF, PNG, JPG, TIFF"}</p>
//           <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
//             <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={onSelect} style={{ display: "inline-block" }} />
//             <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
//               <option value="SHORT">Short</option>
//               <option value="MEDIUM">Medium</option>
//               <option value="LONG">Long</option>
//             </select>
//             <button className="btn" onClick={upload} disabled={loading}>
//               {loading ? "Uploading..." : "Summarize"}
//             </button>
//             <button className="btn ghost" onClick={clearFile} disabled={loading}>Clear</button>
//           </div>

//           {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

//           <div style={{ marginTop: 10 }}>
//             <div className="progress-wrap" aria-hidden>
//               <div className="progress" style={{ width: `${progress}%` }} />
//             </div>
//             <small className="muted" style={{ marginTop: 6, display: "block" }}>{progress > 0 ? `Progress: ${progress}%` : ""}</small>
//           </div>
//         </div>
//       </div>

//       {result && <SummaryView result={result} />}
//     </div>
//   );
// }


// import React, { useRef, useState } from "react";
// import SummaryView from "./SummaryView";

// export default function UploadArea() {
//   const fileRef = useRef();
//   const [dragOver, setDragOver] = useState(false);
//   const [file, setFile] = useState(null);
//   const [length, setLength] = useState("MEDIUM");
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   function handleFiles(files) {
//     if (!files || files.length === 0) return;
//     setFile(files[0]);
//     setError("");
//     setResult(null);
//   }

//   function onDrop(e) {
//     e.preventDefault();
//     setDragOver(false);
//     const dt = e.dataTransfer;
//     const files = dt?.files;
//     handleFiles(files);
//   }

//   function onSelect(e) {
//     handleFiles(e.target.files);
//   }

//   function clearFile() {
//     setFile(null);
//     if (fileRef.current) fileRef.current.value = "";
//   }

//   function upload() {
//     if (!file) return setError("Choose a file first");
//     setLoading(true);
//     setProgress(0);
//     setError("");
//     setResult(null);

//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("length", length);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "http://localhost:8000/api/process", true);

//     xhr.upload.onprogress = function (e) {
//       if (e.lengthComputable) {
//         const pct = Math.round((e.loaded / e.total) * 100);
//         setProgress(pct);
//       }
//     };

//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//         setLoading(false);
//         setProgress(100);
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             const json = JSON.parse(xhr.responseText);
//             setResult(json);
//           } catch (err) {
//             setError("Invalid server response");
//           }
//         } else {
//           try {
//             const json = JSON.parse(xhr.responseText);
//             setError(json.detail || `Server error ${xhr.status}`);
//           } catch {
//             setError(`Server error ${xhr.status}`);
//           }
//         }
//       }
//     };

//     xhr.onerror = function () {
//       setLoading(false);
//       setError("Network error: failed to upload");
//     };

//     xhr.send(fd);
//   }

//   return (
//     <div className="upload">
//       <div
//         className={`dropzone ${dragOver ? "dragover" : ""}`}
//         onDrop={onDrop}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//         role="region"
//         aria-label="File upload drop zone"
//       >
//         <div className="left" aria-hidden>
//           <svg viewBox="0 0 24 24" fill="none" aria-hidden>
//             <path d="M12 3v10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//             <path d="M7 10l5-5 5 5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>

//         <div className="meta">
//           <strong>{file ? file.name : "Drop file here or click to upload"}</strong>
//           <p className="muted">{file ? `${(file.size/1024).toFixed(1)} KB` : "Supports: PDF, PNG, JPG, TIFF"}</p>

//           <div className="controls-row" style={{ marginTop: 10 }}>
//             <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={onSelect} style={{ display: "inline-block" }} />
//             <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
//               <option value="SHORT">Short</option>
//               <option value="MEDIUM">Medium</option>
//               <option value="LONG">Long</option>
//             </select>

//             <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap" }}>
//               <button className="btn" style={{ flex: "1 1 auto" }} onClick={upload} disabled={loading}>{loading ? "Uploading..." : "Summarize"}</button>
//               <button className="btn ghost" style={{ flex: "0 0 140px" }} onClick={clearFile} disabled={loading}>Clear</button>
//             </div>
//           </div>

//           {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

//           <div style={{ marginTop: 12 }}>
//             <div className="progress-wrap" aria-hidden>
//               <div className="progress" style={{ width: `${progress}%` }} />
//             </div>
//             <small className="muted" style={{ marginTop: 6, display: "block" }}>{progress > 0 ? `Progress: ${progress}%` : ""}</small>
//           </div>
//         </div>
//       </div>

//       {result && <SummaryView result={result} />}
//     </div>
//   );
// }


import React, { useRef, useState } from "react";
import SummaryView from "./SummaryView";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UploadArea() {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [length, setLength] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFiles(files) {
    if (!files || files.length === 0) return;
    setFile(files[0]);
    setError("");
    setResult(null);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dt = e.dataTransfer;
    const files = dt?.files;
    handleFiles(files);
  }

  function onSelect(e) {
    handleFiles(e.target.files);
  }

  function clearFile() {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function upload() {
    if (!file) return setError("Choose a file first");
    setLoading(true);
    setProgress(0);
    setError("");
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("length", length);

    const xhr = new XMLHttpRequest();
    const endpoint = `${API_BASE}/api/process`;
    xhr.open("POST", endpoint, true);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        setLoading(false);
        setProgress(100);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            setResult(json);
          } catch (err) {
            setError("Invalid server response");
          }
        } else {
          try {
            const json = JSON.parse(xhr.responseText);
            setError(json.detail || `Server error ${xhr.status}`);
          } catch {
            setError(`Server error ${xhr.status}`);
          }
        }
      }
    };

    xhr.onerror = function () {
      setLoading(false);
      setError("Network error: failed to upload");
    };

    xhr.send(fd);
  }

  return (
    <div className="upload">
      <div
        className={`dropzone ${dragOver ? "dragover" : ""}`}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        role="region"
        aria-label="File upload drop zone"
      >
        <div className="left" aria-hidden>
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" aria-hidden>
            <path d="M12 3v10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10l5-5 5 5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="meta">
          <strong title={file ? file.name : ""}>{file ? file.name : "Drop file here or click to upload"}</strong>
          <p className="muted">{file ? `${(file.size/1024).toFixed(1)} KB` : "Supports: PDF, PNG, JPG, TIFF"}</p>

          <div className="controls-row" style={{ marginTop: 10 }}>
            <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={onSelect} />
            <select className="select" value={length} onChange={(e) => setLength(e.target.value)}>
              <option value="SHORT">Short</option>
              <option value="MEDIUM">Medium</option>
              <option value="LONG">Long</option>
            </select>

            <div className="button-row" style={{ marginTop: 6 }}>
              <button className="btn" onClick={upload} disabled={loading}>{loading ? "Uploading..." : "Summarize"}</button>
              <button className="btn ghost" onClick={clearFile} disabled={loading}>Clear</button>
            </div>
          </div>

          {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

          <div style={{ marginTop: 12 }}>
            <div className="progress-wrap" aria-hidden>
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>
            <small className="muted" style={{ marginTop: 6, display: "block" }}>{progress > 0 ? `Progress: ${progress}%` : ""}</small>
          </div>
        </div>
      </div>

      {result && <SummaryView result={result} />}
    </div>
  );
}
