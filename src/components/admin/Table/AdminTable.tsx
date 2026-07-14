import type { ReactNode } from "react";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  emptyMessage: string;
  getRowKey: (item: T) => string | number;
}

export default function AdminTable<T>({
  columns,
  data,
  emptyMessage,
  getRowKey,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="block w-full text-left sm:table sm:min-w-full sm:divide-y sm:divide-stone-100">
          <thead className="hidden bg-orange-50/70 sm:table-header-group">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                className={`px-4 py-3 text-[11px] font-black uppercase tracking-wide text-stone-500 ${
                    column.className ?? ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="block space-y-3 bg-[#fffaf4] p-3 sm:table-row-group sm:space-y-0 sm:divide-y sm:divide-stone-100 sm:bg-white sm:p-0">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={getRowKey(item)} className="block overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm transition hover:bg-orange-50/40 sm:table-row sm:rounded-none sm:border-0 sm:shadow-none">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`flex min-w-0 items-center justify-between gap-4 border-b border-stone-100 px-4 py-3 text-sm text-stone-700 last:border-b-0 sm:table-cell sm:border-b-0 ${
                        column.className ?? ""
                      }`}
                    >
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-wide text-stone-400 sm:hidden">
                        {column.header}
                      </span>
                      <div className="min-w-0 text-right sm:text-left">{column.render(item)}</div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="block rounded-xl bg-white sm:table-row">
                <td
                  colSpan={columns.length}
                  className="block px-5 py-10 text-center text-sm font-medium text-stone-500 sm:table-cell"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
