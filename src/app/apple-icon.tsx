import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0d0b",
        borderRadius: "36px",
        fontSize: 120,
        fontWeight: 900,
        fontStyle: "italic",
        fontFamily: "serif",
        color: "#d44a2a",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ lineHeight: 1 }}>s</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 400,
            fontStyle: "normal",
            color: "#c49b2a",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          cuaderno
        </span>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
