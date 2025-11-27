import { useEffect } from "react";
import { getSocket } from "../socket";
import { useToast } from "../context/ToastContext";

export default function SocketListener() {
  const { addToast } = useToast();

  useEffect(() => {
    const socket = getSocket();

    // No socket yet (user not logged in)
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Connected to WebSocket server:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    const handleNewEnrollment = (data) => {
      console.log("📢 New enrollment:", data);
      addToast(`📚 ${data.message}`);
    };

    const handleStatusUpdate = (data) => {
      console.log("📢 Enrollment status updated:", data);
      addToast(`🔄 Status updated for student ${data.student_id}`);
    };

    const handleNotification = (data) => {
      console.log("🔔 Notification received:", data);
      addToast(`🔔 ${data.title}: ${data.message}`);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newEnrollment", handleNewEnrollment);
    socket.on("enrollmentStatusUpdate", handleStatusUpdate);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newEnrollment", handleNewEnrollment);
      socket.off("enrollmentStatusUpdate", handleStatusUpdate);
      socket.off("notification", handleNotification);
    };
  }, [addToast]);

  return null;
}
