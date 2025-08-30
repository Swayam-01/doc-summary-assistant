// // import React from "react";

// // export default function SummaryView({ result }) {
// //   return (
// //     <div className="card" style={{ marginTop: 16 }}>
// //       <h2>Summary</h2>
// //       <p>{result.summary}</p>

// //       {result.highlights && result.highlights.length > 0 && (
// //         <>
// //           <h3>Highlights</h3>
// //           <ul>
// //             {result.highlights.map((h, i) => (
// //               <li key={i}>{h}</li>
// //             ))}
// //           </ul>
// //         </>
// //       )}

// //       {result.suggested_actions && result.suggested_actions.length > 0 && (
// //         <>
// //           <h3>Suggested actions</h3>
// //           <ul>
// //             {result.suggested_actions.map((a, i) => (
// //               <li key={i}>{a}</li>
// //             ))}
// //           </ul>
// //         </>
// //       )}
// //     </div>
// //   );
// // }


// import React from "react";

// export default function SummaryView({ result }) {
//   const copy = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       alert("Copied to clipboard");
//     } catch {
//       alert("Copy failed — select and copy manually");
//     }
//   };

//   const downloadTxt = (filename = "summary.txt") => {
//     const blob = new Blob([result.summary || ""], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="card" style={{ marginTop: 16 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
//         <div>
//           <h3>Summary</h3>
//           <p className="muted" style={{ marginTop: 6 }}>Concise, machine-generated summary — verify facts when needed.</p>
//         </div>

//         <div className="actions" style={{ marginLeft: 12 }}>
//           <button className="btn ghost" onClick={() => copy(result.summary || "")}>Copy</button>
//           <button className="btn ghost" onClick={() => downloadTxt()}>Download</button>
//         </div>
//       </div>

//       <div className="summary" style={{ marginTop: 12 }}>
//         <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{result.summary}</p>

//         {result.highlights && result.highlights.length > 0 && (
//           <>
//             <h4 style={{ marginTop: 14 }}>Key points</h4>
//             <div className="highlight-list">
//               {result.highlights.map((h, i) => (
//                 <div className="highlight" key={i}>
//                   <div style={{ width: 8, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#6EE7B7,#3B82F6)" }} />
//                   <div style={{ color: "var(--muted)" }}>{h}</div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {result.suggested_actions && result.suggested_actions.length > 0 && (
//           <>
//             <h4 style={{ marginTop: 14 }}>Suggested actions</h4>
//             <ul className="bullets">
//               {result.suggested_actions.map((a, i) => <li key={i}>{a}</li>)}
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

export default function SummaryView({ result }) {
  const [done, setDone] = useState({}); // track completed actions by index

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // small non-blocking visual feedback
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed — select and copy manually");
    }
  };

  const toggleDone = (i) => {
    setDone((d) => ({ ...d, [i]: !d[i] }));
  };

  const downloadTxt = (filename = "summary.txt") => {
    const blob = new Blob([result.summary || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
        <div>
          <h3>Summary</h3>
          <p className="muted" style={{ marginTop: 6 }}>Concise, machine-generated summary — verify facts when needed.</p>
        </div>

        <div className="actions" style={{ marginLeft: 12 }}>
          <button className="btn ghost" onClick={() => copy(result.summary || "")}>Copy</button>
          <button className="btn ghost" onClick={() => downloadTxt()}>Download</button>
        </div>
      </div>

      <div className="summary" style={{ marginTop: 12 }}>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{result.summary}</p>

        {result.highlights && result.highlights.length > 0 && (
          <>
            <h4 style={{ marginTop: 14 }}>Key points</h4>
            <div className="highlight-list">
              {result.highlights.map((h, i) => (
                <div className="highlight" key={i}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#6EE7B7,#3B82F6)" }} />
                  <div style={{ color: "var(--muted)" }}>{h}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Suggested actions */}
        <div style={{ marginTop: 14 }}>
          <h4>Suggested actions</h4>
          {result.suggested_actions && result.suggested_actions.length > 0 ? (
            <ul className="bullets" style={{ marginTop: 8 }}>
              {result.suggested_actions.map((a, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, textDecoration: done[i] ? "line-through" : "none", color: done[i] ? "gray" : "inherit" }}>{a}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn ghost" onClick={() => copy(a)}>Copy</button>
                    <button
                      className="btn ghost"
                      onClick={() => toggleDone(i)}
                      aria-pressed={!!done[i]}
                    >
                      {done[i] ? "Undo" : "Done"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No suggested actions generated for this document.</p>
          )}
        </div>
      </div>
    </div>
  );
}
