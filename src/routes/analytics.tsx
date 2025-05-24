import { createFileRoute } from "@tanstack/react-router";
import AnalyticsPage from "../components/pages/Analytics/AnalyticsPage";

export const Route = createFileRoute("/analytics")({
	component: AnalyticsPage,
});
