const UserDashboard = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth / 2; // Adjust width as needed
        canvas.height = window.innerHeight / 2; // Adjust height as needed
        contextRef.current = canvas.getContext("2d");
        contextRef.current.lineWidth = 2;
        contextRef.current.strokeStyle = "black";
        contextRef.current.lineCap = "round";
    };

    const startDrawing = (e) => {
        if (!contextRef.current) return; // Add check
        contextRef.current.beginPath();
        contextRef.current.moveTo(
            e.nativeEvent.offsetX || e.clientX - canvasRef.current.getBoundingClientRect().left,
            e.nativeEvent.offsetY || e.clientY - canvasRef.current.getBoundingClientRect().top
        );
        canvasRef.current.addEventListener("mousemove", draw);
    };

    const draw = (e) => {
        if (!contextRef.current) return; // Add check
        contextRef.current.lineTo(
            e.nativeEvent.offsetX || e.clientX - canvasRef.current.getBoundingClientRect().left,
            e.nativeEvent.offsetY || e.clientY - canvasRef.current.getBoundingClientRect().top
        );
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        canvasRef.current.removeEventListener("mousemove", draw);
    };

    const clearCanvas = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const saveDrawing = () => {
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    useEffect(() => {
        setupCanvas();
    }, []);

    return (
        <div className="dashboard">
            <h2>User Dashboard</h2>
            <div className="section">
                <h3>Upload Map</h3>
                <input type="file" className="file-input" />
            </div>
            <div className="section">
                <h3>Building Tool</h3>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ border: "1px solid black" }}
                />
                <div>
                    <button className="primary-btn" onClick={clearCanvas}>Clear</button>
                    <button className="primary-btn" onClick={saveDrawing}>Save</button>
                </div>
            </div>
            <div className="section">
                <h3>Contact Architect</h3>
                <button className="primary-btn">Contact an Architect</button>
            </div>
        </div>
    );
};
