import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "../components/pages/Dashboard/DashboardPage";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});
