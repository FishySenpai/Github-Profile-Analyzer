"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Download, FileText, Loader2 } from "lucide-react";
import { exportProfileToPDF} from "@/lib/pdf-export";

interface ExportPDFButtonProps {
  profileName: string;
  username: string;
}

export function ExportPDFButton({
  username,
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleFullExport = async () => {
    setIsExporting(true);
    const loadingToast = toast.loading("Generating PDF...");

    try {
      await exportProfileToPDF("profile-content", username);
      toast.success("PDF exported successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // const handleSectionExport = async (
  //   sectionId: string,
  //   sectionName: string
  // ) => {
  //   setIsExporting(true);
  //   const loadingToast = toast.loading(`Exporting ${sectionName}...`);

  //   try {
  //     await exportSectionToPDF(
  //       sectionId,
  //       `${username}-${sectionName.toLowerCase().replace(/\s+/g, "-")}.pdf`
  //     );
  //     toast.success(`${sectionName} exported successfully!`, {
  //       id: loadingToast,
  //     });
  //   } catch (error) {
  //     console.error("Export error:", error);
  //     toast.error(`Failed to export ${sectionName}`, { id: loadingToast });
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleFullExport} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          Full Profile (PDF)
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

