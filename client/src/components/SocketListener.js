import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../socket";
import { useToast } from "../context/ToastContext";

export default function SocketListener() {
  const { addToast } = useToast();

  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", () => console.log("✅ Connected", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));
    socket.on("newEnrollment", (data) => addToast(`📚 ${data.message}`));
    socket.on("enrollmentStatusUpdate", (data) => addToast(`🔄 Status updated for student ${data.student_id}`));
    socket.on("notification", (data) => addToast(`🔔 ${data.title}: ${data.message}`));

    return () => disconnectSocket(); // disconnect when unmount
  }, [addToast]);

  return null;
}
