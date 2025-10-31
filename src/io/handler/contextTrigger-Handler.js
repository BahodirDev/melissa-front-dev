import { reportContextHandler } from "../../context/contextHandler";

export default function contextTriggerHandler(trigger, payload, dispatch) {
  const { action, data } = payload;

  switch (trigger) {
    case "report_event":
      console.log("🧩 Trigger:", trigger, "Action:", action);
      reportContextHandler(dispatch, action, data);
      break;

    default:
      console.warn("⚠️ Unknown trigger:", trigger);
      break;
  }
}
