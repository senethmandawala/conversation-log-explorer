import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutopilot } from "@/contexts/AutopilotContext";
import AutopilotConfiguration from "./AutopilotConfiguration";

export default function AutopilotSettings() {
  const navigate = useNavigate();
  const { selectedInstance } = useAutopilot();

  useEffect(() => {
    if (!selectedInstance) {
      navigate("/autopilot");
    }
  }, [selectedInstance, navigate]);

  if (!selectedInstance) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <AutopilotConfiguration />
    </div>
  );
}
