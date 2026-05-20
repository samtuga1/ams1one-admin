"use client";

import CustomInputComponent from "@/components/custom-input-component";
import CustomCheckboxItem from "@/components/custom-checkbox";
import CustomTable from "@/components/custom-table";
import FinancialsService from "@/api/financials";
import type { IReportDefinition } from "@/interfaces/financials.interface";
import ToastService from "@/utils/toast-service";
import EmptyImage from "@/public/images/new/empty-page.jpg";
import Image from "next/image";
import {
  Button,
  Header,
  Label,
  ListBox,
  Select,
  Separator,
  Spinner,
} from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { usePageAccess } from "@/hooks/use-page-access";
import { RiDownloadLine } from "react-icons/ri";
import ApiError from "@/utils/api_error";

const PAGE_SIZE = 20;

function ReportsView() {
  const { hasPage } = usePageAccess();
  const canExecute = hasPage("reports.execute");
  const canDownload = hasPage("reports.download");

  const { data: reports = [] } = useQuery({
    queryKey: ["financials", "reports"],
    queryFn: FinancialsService.fetchReports,
  });
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [optionalSelectedColumns, setOptionalSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [previewPage, setPreviewPage] = useState(1);
  const resolvedReportId = selectedReportId ?? reports[0]?.reportId ?? null;

  const selectedReport = useMemo(
    () => reports.find((r) => r.reportId === resolvedReportId) ?? null,
    [reports, resolvedReportId],
  );

  const executeMutation = useMutation({
    mutationKey: ["financials", "execute-report"],
    mutationFn: (payload: {
      reportId: number;
      filters: Record<string, string | number>;
    }) => FinancialsService.executeReport(payload.reportId, payload.filters),
    onError: (error: ApiError) => {
      ToastService.error({
        text: error?.message ?? "Unable to generate report",
      });
    },
  });

  const previewRows = useMemo(
    () => executeMutation.data?.data ?? [],
    [executeMutation.data?.data],
  );

  const visibleColumns = useMemo(() => {
    if (!selectedReport) return [];
    return selectedReport.schema.columns.filter(
      (col) => col.required || optionalSelectedColumns[col.key],
    );
  }, [optionalSelectedColumns, selectedReport]);

  const totalPreviewPages = Math.max(
    1,
    Math.ceil(previewRows.length / PAGE_SIZE),
  );

  const pagedRows = useMemo(() => {
    const start = (previewPage - 1) * PAGE_SIZE;
    return previewRows.slice(start, start + PAGE_SIZE);
  }, [previewRows, previewPage]);

  const groupedReports = useMemo(() => {
    const groups = new Map<string, IReportDefinition[]>();
    for (const report of reports) {
      const category = report.schema.category || "General";
      const current = groups.get(category) ?? [];
      current.push(report);
      groups.set(category, current);
    }
    return Array.from(groups.entries()).map(([key, values]) => ({
      key,
      values,
    }));
  }, [reports]);

  const onDownloadCsv = () => {
    if (!previewRows.length || !visibleColumns.length) return;
    const escape = (val: unknown) => {
      const str = String(val ?? "");
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };
    const header = visibleColumns.map((c) => escape(c.label)).join(",");
    const rows = previewRows
      .map((row) => visibleColumns.map((c) => escape(row[c.key])).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${rows}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${executeMutation.data?.report_name ?? "report"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onGenerate = async () => {
    if (!selectedReport) return;
    const required = selectedReport.schema.filters.filter((f) => f.required);
    for (const req of required) {
      const val = filters[req.key]?.trim();
      if (!val) {
        ToastService.error({ text: `${req.label} is required.` });
        return;
      }
    }
    const payload: Record<string, string | number> = {};
    Object.entries(filters).forEach(([k, v]) => {
      const trimmed = v.trim();
      if (trimmed) payload[k] = trimmed;
    });
    try {
      const result = await executeMutation.mutateAsync({
        reportId: selectedReport.reportId,
        filters: payload,
      });
      setPreviewPage(1);
      if (!result.status) {
        ToastService.error({
          text: result.message || "Report execution failed",
        });
      }
    } catch (error) {
      ToastService.error({
        text:
          error instanceof Error ? error.message : "Report execution failed",
      });
    }
  };

  const tableColumns = visibleColumns.map((col) => ({
    key: col.key,
    label: col.label,
    sortable: false,
  }));

  const tableData = pagedRows.map((row) =>
    Object.fromEntries(
      visibleColumns.map((col) => [col.key, String(row[col.key] ?? "")]),
    ),
  );

  const tablePagination = {
    pageNumber: previewPage,
    pageSize: PAGE_SIZE,
    totalCount: previewRows.length,
  };

  return (
    <div className="flex flex-col h-full px-7 py-5 gap-4 overflow-hidden">
      {/* Page title */}
      <span className="text-sm sm:text-lg font-gotham-black uppercase shrink-0">
        REPORTS
      </span>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          {/* Report selector */}
          <div className="shrink-0">
            <ReportsSelection
              reports={groupedReports}
              onSelected={(val) => {
                setSelectedReportId(val.reportId);
                setOptionalSelectedColumns({});
                setFilters({});
                setPreviewPage(1);
                executeMutation.reset();
              }}
              selectedValue={selectedReport}
            />
          </div>

          {/* Config card — scrolls internally */}
          <div className="flex-1 min-h-0 rounded-lg border flex flex-col overflow-hidden">
            {/* Category label */}
            <div className="px-5 pt-4 pb-3 shrink-0 border-b">
              <span className="text-xs font-gotham-bold text-gray-500 uppercase tracking-wide">
                {selectedReport?.schema.category ?? "General"}
              </span>
            </div>

            {/* Scrollable filters + columns */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5">
              {/* Filters */}
              {(selectedReport?.schema.filters ?? []).length > 0 && (
                <div className="space-y-3">
                  <span className="text-[0.65rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                    Filters
                  </span>
                  {(selectedReport?.schema.filters ?? []).map((filter) => {
                    if (filter.type === "date") {
                      return (
                        <div key={filter.key} className="max-w-[220px]">
                          <Label className="text-xs">{filter.label}</Label>
                          <input
                            type="date"
                            value={filters[filter.key] ?? ""}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [filter.key]: e.target.value,
                              }))
                            }
                            className="mt-2 w-full border rounded-lg border-gray-300 px-3 py-2 text-xs"
                          />
                        </div>
                      );
                    }
                    return (
                      <CustomInputComponent
                        key={filter.key}
                        className="max-w-[220px] p-0 border border-gray-400 rounded-lg"
                        label={filter.label}
                        placeholder={`Input ${filter.label}`}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value,
                          }))
                        }
                      />
                    );
                  })}
                </div>
              )}

              {/* Columns */}
              {(selectedReport?.schema.columns ?? []).length > 0 && (
                <div className="space-y-3">
                  <span className="text-[0.65rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                    Columns
                  </span>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {(selectedReport?.schema.columns ?? []).map((column) => (
                      <CustomCheckboxItem
                        key={column.key}
                        selected={
                          column.required || optionalSelectedColumns[column.key]
                        }
                        label={column.label}
                        labelClassName="font-gotham-regular"
                        isDisabled={column.required}
                        setIsSelected={(checked) =>
                          setOptionalSelectedColumns((prev) => ({
                            ...prev,
                            [column.key]: Boolean(checked),
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate button pinned to bottom */}
            {canExecute && (
              <div className="px-5 pb-5 pt-3 shrink-0 border-t">
                <Button
                  className="w-full rounded-lg bg-black text-white font-gotham-black text-xs py-5"
                  isDisabled={!selectedReport || executeMutation.isPending}
                  onClick={onGenerate}
                  isPending={executeMutation.isPending}
                >
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner color="current" size="sm" />}
                      GENERATE REPORT
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column — preview ── */}
        <div className="flex flex-col h-full min-h-0 rounded-lg border overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3 shrink-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-gotham-bold">Preview</span>
              {executeMutation.data && (
                <span className="text-[0.6rem] text-gray-400 font-gotham-regular mt-0.5">
                  {executeMutation.data.report_name}
                  {` · ${previewRows.length.toLocaleString("en-US")} records`}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {canDownload && (
                <Button
                  size="sm"
                  className="text-[0.65rem] bg-primary text-white rounded-lg font-gotham-bold"
                  isDisabled={!previewRows.length}
                  onClick={onDownloadCsv}
                >
                  <RiDownloadLine className="w-3 h-3" />
                  Download
                </Button>
              )}
              {/* <Button
                size="sm"
                className="text-[0.65rem] bg-black border text-white rounded-lg font-gotham-bold"
                onClick={() =>
                  ToastService.info({ text: "Feature not yet available" })
                }
              >
                <IoMailOutline className="w-3 h-3" />
                Email
              </Button> */}
            </div>
          </div>
          <Separator />

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {!executeMutation.data ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
                <div className="relative w-48 h-48">
                  <Image
                    src={EmptyImage}
                    alt="No report generated"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-gotham-bold text-gray-700 text-center">
                  No report generated yet
                </p>
                <p className="text-xs text-gray-400 text-center max-w-[200px]">
                  Select a report, configure filters, then click Generate
                  Report.
                </p>
              </div>
            ) : (
              /* Data state — CustomTable */
              <div className="h-full overflow-hidden">
                <CustomTable
                  columns={tableColumns}
                  data={tableData}
                  pagination={tablePagination}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => setPreviewPage(page)}
                  onPageSizeChange={() => {}}
                  onRowClick={() => {}}
                  onSort={() => {}}
                  loading={executeMutation.isPending}
                  isRefetching={false}
                  addTableBorder={false}
                  emptyMessage={
                    totalPreviewPages === 0
                      ? "No rows returned"
                      : "No data available"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsView;

type Props = {
  reports: Array<{ key: string; values: IReportDefinition[] }>;
  onSelected: (value: IReportDefinition) => void;
  selectedValue: IReportDefinition | null;
};

const ReportsSelection = ({ reports, onSelected, selectedValue }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = selectedValue?.name ?? "";

  function handleAction(payload: IReportDefinition) {
    setIsOpen(false);
    onSelected(payload);
  }

  return (
    <Select
      placeholder="Select a Report"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Label className="text-xs font-gotham-bold text-gray-500">
        Select a Report
      </Label>
      <Select.Trigger
        className="border border-gray-200 shadow-none rounded-lg bg-white hover:border-gray-400 transition-colors w-full"
        onClick={() => setIsOpen(true)}
      >
        <Select.Value className="text-xs">
          {selectedLabel || "Select a Report"}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="rounded-lg">
        <ListBox>
          {reports.map((section, sIndex) => (
            <ListBox.Section key={section.key}>
              <Header className="px-4 py-2 text-[10px] font-gotham-medium text-gray-400 uppercase tracking-wider">
                {section.key}
              </Header>
              {section.values.map((report) => (
                <ListBox.Item
                  key={report.reportId}
                  id={report.name.toLowerCase().replace(/\s+/g, "-")}
                  textValue={report.name}
                  onAction={() => handleAction(report)}
                  className="flex items-center px-4 py-2 text-xs rounded-lg cursor-pointer hover:bg-gray-200/50 outline-none transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="flex-1 truncate group-selected:font-gotham-medium">
                      {report.name}
                    </span>
                  </div>
                </ListBox.Item>
              ))}
              {sIndex < reports.length - 1 && (
                <div className="h-px bg-gray-500/30 my-1 mx-2" />
              )}
            </ListBox.Section>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
