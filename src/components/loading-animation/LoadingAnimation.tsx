function LoadingAnimation({
  color = "primary",
}: { color?: "primary" | "white" } = {}) {
  return (
    <div className="loader-container w-100 w-100 flex items-center justify-center">
      <div className={`loader loader-${color}`}></div>
    </div>
  );
}

export default LoadingAnimation;
