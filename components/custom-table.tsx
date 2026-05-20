"use client";

import { Pagination, Table, Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import NProgress from "nprogress";
import { IPagination } from "@/interfaces/general.interface";
import { RiExpandUpDownFill } from "react-icons/ri";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableRow {
  [key: string]: React.ReactNode;
}

export interface CustomTableProps {
  columns: TableColumn[];
  data: TableRow[];
  pageSize?: number;
  pagination?: IPagination;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (row: TableRow, index: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  enablePagination?: boolean;
  onRender?: (
    row: TableRow,
    index: number,
    columns: TableColumn[],
  ) => React.ReactNode;
  loading?: boolean;
  isRefetching: boolean;
  emptyMessage?: string;
  className?: string;
  addTableBorder?: boolean;
}

function CustomTable({
  columns,
  data,
  pagination = {
    totalCount: 1,
    pageNumber: 1,
    pageSize: 1,
  },
  onPageChange,
  onRowClick,
  onSort,
  addTableBorder = true,
  onRender,
  enablePagination = true,
  loading = false,
  isRefetching = false,
  emptyMessage = "No data available",
  className = "",
}: CustomTableProps) {
  const totalPages = pagination
    ? Math.ceil(pagination.totalCount / pagination.pageSize)
    : 1;

  const backendCurrentPage = pagination?.pageNumber || 1;
  const [internalCurrentPage, setInternalCurrentPage] =
    useState(backendCurrentPage);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    const current = internalCurrentPage;
    const visible: Array<number | "ellipsis-left" | "ellipsis-right"> = [1];

    const left = Math.max(2, current - 1);
    const right = Math.min(totalPages - 1, current + 1);

    if (left > 2) {
      visible.push("ellipsis-left");
    }

    for (let p = left; p <= right; p += 1) {
      visible.push(p);
    }

    if (right < totalPages - 1) {
      visible.push("ellipsis-right");
    }

    visible.push(totalPages);
    return visible;
  };

  const start = (internalCurrentPage - 1) * pagination.pageSize + 1;
  const end = Math.min(
    internalCurrentPage * pagination.pageSize,
    pagination.totalCount,
  );

  const handlePageChange = (page: number) => {
    setInternalCurrentPage(page);
    onPageChange?.(page);
  };

  const handleSort = (column: string) => {
    onSort?.(column, "asc");
  };

  useEffect(() => {
    if (isRefetching) {
      NProgress.start();
    } else {
      NProgress.done();
    }
    return () => {
      NProgress.done();
    };
  }, [isRefetching]);

  return (
    <div className={`flex flex-col sm:h-full min-w-0 ${className}`}>
      <div className="sm:flex-1 sm:min-h-0 min-w-0 flex flex-col">
        <Table
          className={`w-full min-w-0 rounded-lg bg-transparent ${addTableBorder ? "border" : ""} sm:h-full flex flex-col`}
        >
          <Table.ScrollContainer className="w-full min-w-0 flex-1 min-h-0 overflow-x-auto overflow-y-auto max-h-[min(58dvh,26rem)] md:max-h-[min(62dvh,30rem)] lg:max-h-[min(62dvh,30rem)] lg:overflow-y-auto">
            <Table.Content
              aria-label="Custom data table"
              className="w-full min-w-[720px] rounded-lg bg-transparent [&_td]:text-xs"
            >
              <Table.Header className="sticky top-0 z-10 bg-[#F9FAFB] border-b">
                {columns.map((column) => (
                  <Table.Column
                    key={column.key}
                    id={column.key}
                    isRowHeader={columns[0].key === column.key}
                    allowsSorting={column.sortable}
                    className="bg-[#F9FAFB]"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-gotham-bold">
                        {column.label}
                      </span>
                      {column.sortable && (
                        <RiExpandUpDownFill
                          className="py-1 px-0 cursor-pointer"
                          onClick={() => handleSort(column.key)}
                        />
                      )}
                    </div>
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body
                renderEmptyState={() =>
                  loading ? (
                    <div className="flex justify-center py-8">
                      <Spinner className="animate-appearance-in" size="sm" />
                    </div>
                  ) : (
                    <div className="text-center py-8">{emptyMessage}</div>
                  )
                }
              >
                {!loading &&
                  data.map((row, index) => {
                    if (onRender) {
                      return onRender(row, index, columns);
                    }

                    return (
                      <Table.Row
                        key={index}
                        id={index}
                        className="hover:bg-gray-50 cursor-pointer transition-all rounded-lg border"
                        onAction={() => {
                          onRowClick?.(row, index);
                        }}
                      >
                        {columns.map((column) => (
                          <Table.Cell key={column.key}>
                            <div className="flex items-center justify-between gap-2 w-full min-w-0 rounded-lg px-2 py-1 bg-transparent">
                              <span className="truncate flex-1 min-w-0">
                                {row[column.key]}
                              </span>
                            </div>
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>

          {!loading && enablePagination && (
            <Table.Footer className="border-t">
              <Pagination size="sm">
                <Pagination.Summary>
                  {start} to {end} of {pagination.totalCount} results
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={internalCurrentPage <= 1}
                      onPress={() =>
                        handlePageChange(Math.max(1, internalCurrentPage - 1))
                      }
                    >
                      <Pagination.PreviousIcon />
                      Prev
                    </Pagination.Previous>
                  </Pagination.Item>
                  {getVisiblePages().map((item, index) => {
                    if (typeof item !== "number") {
                      return (
                        <Pagination.Item key={`${item}-${index}`}>
                          <Pagination.Ellipsis />
                        </Pagination.Item>
                      );
                    }

                    return (
                      <Pagination.Item key={item}>
                        <Pagination.Link
                          isActive={item === internalCurrentPage}
                          onPress={() => handlePageChange(item)}
                        >
                          {item}
                        </Pagination.Link>
                      </Pagination.Item>
                    );
                  })}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={internalCurrentPage >= totalPages}
                      onPress={() =>
                        handlePageChange(
                          Math.min(totalPages, internalCurrentPage + 1),
                        )
                      }
                    >
                      Next
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </Table.Footer>
          )}
        </Table>
      </div>
    </div>
  );
}

export default CustomTable;
