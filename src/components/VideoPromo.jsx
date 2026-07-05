function VideoPromo() {
  return (
    <section className="py-5">

      <div className="container">

        <div
          className="overflow-hidden rounded-4 shadow-lg"
          style={{
            maxHeight: "650px",
          }}
        >
          <video
            src="/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
        </div>

      </div>

    </section>
  );
}

export default VideoPromo;