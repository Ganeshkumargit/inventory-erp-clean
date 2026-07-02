function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2 text-muted">{message}</p>
    </div>
  );
}

export default LoadingSpinner;