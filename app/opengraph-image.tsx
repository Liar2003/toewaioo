import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Toewaioo — Intermediate Developer from Myanmar";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background:
            "linear-gradient(135deg, #030508 0%, #071014 55%, #0a1a14 100%)",
          color: "#E8F1F5",
          position: "relative",
        }}
      >
        {/* grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(0,245,160,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,245,160,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* brand mark */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 96,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              border: "2px solid rgba(0,245,160,0.9)",
              background: "#030508",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "#00F5A0",
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.35em",
              color: "#71808A",
              textTransform: "uppercase",
            }}
          >
            SYS.ONLINE
          </div>
        </div>

        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.4em",
            color: "#71808A",
            marginBottom: 18,
          }}
        >
          TOEWAIOO
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          <span>Intermediate</span>
          <span style={{ color: "#00F5A0" }}>Developer</span>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            lineHeight: 1.5,
            color: "#71808A",
            maxWidth: 820,
          }}
        >
          Building modern web applications, clean APIs and reliable digital
          systems from Myanmar.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 96,
            display: "flex",
            gap: 14,
            fontSize: 20,
            letterSpacing: "0.15em",
            color: "#00D9FF",
          }}
        >
          {["LARAVEL", "GO", "TYPESCRIPT", "NEXT.JS", "POSTGRESQL", "DOCKER"].map(
            (t) => (
              <span
                key={t}
                style={{
                  border: "1px solid rgba(0,217,255,0.4)",
                  padding: "6px 14px",
                }}
              >
                {t}
              </span>
            )
          )}
        </div>
      </div>
    ),
    size
  );
}
