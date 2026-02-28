import React, { useState } from "react"
import PDF3DViewer from "./components/PDF3DViewer"
import QFXKioskViewer from "./components/QFXKioskViewer"

export default function App() {
  const [view, setView] = useState("pdf")

  return (
    <>
      {/* UI buttons */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 100
      }}>
        <button onClick={() => setView("pdf")}>
          Floorplan Viewer
        </button>

        <button onClick={() => setView("kiosk")}>
          Kiosk Viewer
        </button>
      </div>

      {/* Switch between models */}
      {view === "pdf" ? <PDF3DViewer /> : <QFXKioskViewer />}
    </>
  )
}