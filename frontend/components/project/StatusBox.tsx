import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; 
import Link from "next/link";

export interface DataStat {
  step: number;
  project:string;
  status: "start" | "done" | "error" | "";
  message: string;
}

interface StatusProps {
  dataStat: DataStat;
}

export default function StatusBox({ dataStat }: StatusProps) {
  const isError = dataStat.status === "error";
  const isLoading = dataStat.status === "start";
  const isSuccess = dataStat.status === "done";
  if (dataStat.message.length===0) return <></>

  return (
    <div className="flex  mb-4 flex-col items-center justify-center p-6 border rounded-md shadow-md bg-white dark:bg-zinc-900 w-full max-w-md mx-auto mt-6 space-y-2">
      <div className="flex items-center space-x-2">
        {isLoading && <Loader2 className="animate-spin text-blue-500" />}
        {isSuccess && <CheckCircle className="text-green-500" />}
        {isError && <XCircle className="text-red-500" />}
        <span className={cn("text-lg font-semibold", {
          "text-blue-600": isLoading,
          "text-green-600": isSuccess,
          "text-red-600": isError,
        })}>
          {dataStat.status.toUpperCase()}
        </span>
      </div>

      <p className="text-muted-foreground text-center">
        <strong>Step {dataStat.step}:</strong> {dataStat.message}
      </p>

      {dataStat.project.length>0 && (
        <Link href={`/projects/${dataStat.project}`}>
        <Button className="cursor-pointer" variant="default">
          Go to Project 
        </Button>
        </Link>
      )}
    </div>
  );
}
