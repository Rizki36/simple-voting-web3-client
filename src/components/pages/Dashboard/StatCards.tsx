import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote, BarChart3, Clock, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsProps {
  stats: {
    totalProposals: number;
    activeProposals: number;
    totalVotes: number;
    endingSoon: number;
  };
  isLoading: boolean;
}

const StatCards = ({ stats, isLoading }: StatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <div className="text-2xl font-bold">{stats.totalProposals}</div>
          )}
          <p className="text-xs text-muted-foreground">
            All proposals on the platform
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <div className="text-2xl font-bold">{stats.activeProposals}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Ongoing voting proposals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
          )}
          <p className="text-xs text-muted-foreground">
            All votes across proposals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ending Soon</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <div className="text-2xl font-bold">{stats.endingSoon}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Proposals ending in 24h
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;