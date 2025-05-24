import { createFileRoute } from "@tanstack/react-router";
import ApiPage from "../components/pages/Api/ApiPage";

export const Route = createFileRoute("/api")({
	component: ApiPage,
});
